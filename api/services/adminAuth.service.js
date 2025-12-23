// api/services/adminAuth.service.js
const { User, Role, AdminAuditLog, AdminRefreshToken } = require("../../models");
const bcrypt = require("../../utils/bcrypt");
const jwt = require("../../utils/jwt");

const MAX_FAILED = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 menit

async function audit(user, action, req) {
  await AdminAuditLog.create({
    user_id: user?.id || null,
    action,
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
    created_at: new Date()
  });
}

module.exports = {
  async login(email, password, req) {
    // 1️⃣ Cari user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2️⃣ AUTO-UNLOCK CHECK (OPS I 2)
    if (user.is_locked) {
      const lockedAt = user.locked_at ? new Date(user.locked_at).getTime() : null;

      // Jika tidak ada locked_at → treat as locked
      if (!lockedAt) {
        await audit(user, "LOGIN_BLOCKED_LOCKED", req);
        throw new Error("Account locked");
      }

      const expired = Date.now() - lockedAt > LOCK_DURATION;

      if (expired) {
        // 🔓 AUTO UNLOCK
        user.is_locked = false;
        user.failed_login_attempts = 0;
        user.locked_at = null;
        await user.save();

        await audit(user, "ACCOUNT_AUTO_UNLOCKED", req);
      } else {
        // ⛔ MASIH TERKUNCI
        await audit(user, "LOGIN_BLOCKED_LOCKED", req);
        throw new Error("Account locked, try again later");
      }
    }

    // 3️⃣ Validasi password
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      user.failed_login_attempts += 1;

      // 4️⃣ LOCK JIKA GAGAL >= MAX_FAILED
      if (user.failed_login_attempts >= MAX_FAILED) {
        user.is_locked = true;
        user.locked_at = new Date();

        await audit(user, "ACCOUNT_LOCKED", req);
      } else {
        await audit(user, "LOGIN_FAILED", req);
      }

      await user.save();
      throw new Error("Invalid credentials");
    }

    // 5️⃣ LOGIN SUKSES → RESET COUNTER
    user.failed_login_attempts = 0;
    user.is_locked = false;
    user.locked_at = null;
    await user.save();

    const roles = user.Roles.map(r => r.name);

    // ❌ CUSTOMER tidak boleh login admin
    if (roles.includes("CUSTOMER")) {
      throw new Error("Unauthorized");
    }

    // 6️⃣ Generate tokens
    const payload = { id: user.id, roles };
    const accessToken = jwt.generateAccess(payload);
    const refreshToken = jwt.generateRefresh(payload);

    await audit(user, "LOGIN_SUCCESS", req);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles
      }
    };
  },

  async refresh(token) {
    const decoded = jwt.verifyRefresh(token);
    return {
      accessToken: jwt.generateAccess({
        id: decoded.id,
        roles: decoded.roles
      })
    };
  },

  async logout(refreshToken) {
    await AdminRefreshToken.destroy({
      where: { token: refreshToken }
    });
  }
};
