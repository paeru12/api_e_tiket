// api/services/customerAuth.service.js
const crypto = require("crypto");
const { CustomerUser } = require("../../../models");
const sendEmail = require("../../../utils/sendEmail");
const { buildOtpHtml } = require("../../utils/otpTemplate");

// config (env)
const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS, 10) || 10 * 60;
const RESEND_LOCK_SECONDS = parseInt(process.env.OTP_RESEND_LOCK_SECONDS, 10) || 60;
const MAX_PER_HOUR = parseInt(process.env.OTP_MAX_PER_HOUR, 10) || 10;

// in-memory stores (development)
// email -> { code, expiresAt(ms), timeout }
const otpStore = new Map();
// email -> expiresAt(ms)
const resendLock = new Map();
// email -> { count, expiresAt(ms) }
const hourlyCounter = new Map();

function normalizeEmail(email) {
  if (!email || typeof email !== "string") return null;
  return email.trim().toLowerCase();
}
function genOtp(digits = 6) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return String(crypto.randomInt(min, max + 1));
}
function getHourlyCount(email) {
  const e = hourlyCounter.get(email);
  if (!e || e.expiresAt <= Date.now()) return 0;
  return e.count;
}
function incHourlyCount(email) {
  const now = Date.now();
  const e = hourlyCounter.get(email);
  if (!e || e.expiresAt <= now) {
    hourlyCounter.set(email, { count: 1, expiresAt: now + 3600 * 1000 });
    return 1;
  } else {
    e.count += 1;
    hourlyCounter.set(email, e);
    return e.count;
  }
}
function setResendLock(email, seconds = RESEND_LOCK_SECONDS) {
  const expiresAt = Date.now() + seconds * 1000;
  resendLock.set(email, expiresAt);
  setTimeout(() => resendLock.delete(email), seconds * 1000).unref?.();
}
function isResendLocked(email) {
  const t = resendLock.get(email);
  if (!t) return false;
  return t > Date.now();
}
function storeOtp(email, code, ttl = OTP_TTL_SECONDS) {
  // clear previous if any
  const prev = otpStore.get(email);
  if (prev && prev.timeout) clearTimeout(prev.timeout);

  const expiresAt = Date.now() + ttl * 1000;
  const timeout = setTimeout(() => otpStore.delete(email), ttl * 1000);
  otpStore.set(email, { code: String(code), expiresAt, timeout });
}
function clearOtp(email) {
  const e = otpStore.get(email);
  if (e && e.timeout) clearTimeout(e.timeout);
  otpStore.delete(email);
  resendLock.delete(email);
}

module.exports = {
  // request OTP flow
  async requestOtp(rawEmail) {
    const email = normalizeEmail(rawEmail);
    if (!email) {
      const err = new Error("Invalid email");
      err.statusCode = 400;
      throw err;
    }

    if (isResendLocked(email)) {
      const retryAfter = Math.ceil((resendLock.get(email) - Date.now()) / 1000);
      const err = new Error(`Too many requests, try again in ${retryAfter}s`);
      err.statusCode = 429;
      err.retryAfter = retryAfter;
      throw err;
    }

    const count = getHourlyCount(email);
    if (count >= MAX_PER_HOUR) {
      const err = new Error("OTP request limit reached for this hour");
      err.statusCode = 429;
      throw err;
    }

    // generate and store
    const otp = genOtp(6);
    storeOtp(email, otp, OTP_TTL_SECONDS);
    setResendLock(email, RESEND_LOCK_SECONDS);
    incHourlyCount(email);

    // prepare email
    const subject = "Kode OTP Login Anda";
    const html = buildOtpHtml(otp, email, Math.floor(OTP_TTL_SECONDS / 60));

    try {
      const result = await sendEmail(email, subject, html);
      // if dev Ethereal -> include preview url in response (optional)
      if (result && result.previewUrl) {
        console.info("OTP preview URL:", result.previewUrl);
      }
    } catch (sendErr) {
      console.error("sendEmail error full:", sendErr);
      // cleanup
      try { clearOtp(email); } catch (e) { /* ignore */ }
      const err = new Error("Failed to send OTP email");
      err.statusCode = 500;
      throw err;
    }

    return { message: "OTP sent", otp_ttl: OTP_TTL_SECONDS, resend_locked_for: RESEND_LOCK_SECONDS };
  },

  // verify OTP
  async verifyOtp(rawEmail, code) {
    const email = normalizeEmail(rawEmail);
    if (!email || !code) {
      const err = new Error("Email and OTP required");
      err.statusCode = 400;
      throw err;
    }

    const entry = otpStore.get(email);
    if (!entry) {
      const err = new Error("OTP not found or expired");
      err.statusCode = 400;
      throw err;
    }

    // timing-safe compare (length must match)
    const saved = String(entry.code);
    const a = Buffer.from(saved);
    const b = Buffer.from(String(code));
    let match = false;
    if (a.length === b.length) match = crypto.timingSafeEqual(a, b);

    if (!match) {
      const err = new Error("OTP invalid");
      err.statusCode = 401;
      throw err;
    }

    // success: clear otp
    clearOtp(email);

    // find or create customer user in DB
    let customer = await CustomerUser.findOne({ where: { email } });
    if (!customer) {
      customer = await CustomerUser.create({
        email,
        full_name: null,
        phone: null,
        photo_url: null
      });
    }

    return { message: "OTP valid", customer };
  },

  // utility: for tests only - to inspect store (not used in production)
  _debug: {
    otpStore,
    resendLock,
    hourlyCounter
  }
};
