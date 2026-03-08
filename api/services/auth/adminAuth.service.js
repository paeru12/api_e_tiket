const {
  User,
  Role,
  CreatorUserMember,
  Creator,
  AdminAuditLog,
  AdminRefreshToken,
} = require("../../../models");

const bcrypt = require("bcrypt");
const jwt = require("../../../utils/jwt");

const MAX_FAILED = 5;
const LOCK_DURATION = 30 * 60 * 1000;

async function audit(user, action, req) {
  await AdminAuditLog.create({
    user_id: user?.id || null,
    action,
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
    created_at: new Date(),
  });
}

module.exports = {
  async login(email, password, req) {

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",              // GLOBAL ROLES
        },
        {
          model: CreatorUserMember, // CREATOR MEMBERSHIP
          as: "creator_memberships",
          include: [
            {
              model: Role,
              as: "role",           // CREATOR ROLE
            },
            {
              model: Creator,
              as: "creator",        // CREATOR DATA
            },
          ],
        },
      ],
    });

    if (!user) throw new Error("Email / Password Salah");

    // --- LOCK CHECK BEGIN ---
    if (user.is_locked) {
      const lockedAt = user.locked_at?.getTime();
      if (lockedAt && Date.now() - lockedAt < LOCK_DURATION) {
        await audit(user, "LOGIN_BLOCKED_LOCKED", req);
        throw new Error("Account locked");
      }

      user.is_locked = false;
      user.failed_login_attempts = 0;
      user.locked_at = null;
      await user.save();
      await audit(user, "ACCOUNT_AUTO_UNLOCKED", req);
    }
    // --- LOCK CHECK END ---

    // Validate password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      user.failed_login_attempts += 1;

      if (user.failed_login_attempts >= MAX_FAILED) {
        user.is_locked = true;
        user.locked_at = new Date();
        await audit(user, "ACCOUNT_LOCKED", req);
      } else {
        await audit(user, "LOGIN_FAILED", req);
      }

      await user.save();
      throw new Error("Email / Password Salah");
    }

    // Reset fail count
    user.failed_login_attempts = 0;
    user.is_locked = false;
    user.locked_at = null;
    await user.save();

    // --- ROLE PROCESSING ---
    const globalRoles = user.roles.map((r) => r.name);

    const creatorRoles = user.creator_memberships.map((m) => m.role.name);

    // Only if user is part of exactly 1 creator
    const creator_id =
      user.creator_memberships.length > 0
        ? user.creator_memberships[0].creator_id
        : null;

    const img = user.image ? process.env.MEDIA_URL_AUTH + user.image : null;

    const payload = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      img,
      globalRoles,
      creatorRoles,
      creator_id,
    };

    const accessToken = jwt.generateAccess(payload);
    const refreshToken = jwt.generateRefresh(payload);

    await AdminRefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 86400000),
    });

    await audit(user, "LOGIN_SUCCESS", req);

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  },

  async refresh(token) {
    const decoded = jwt.verifyRefresh(token);

    const existing = await AdminRefreshToken.findOne({
      where: { token },
    });

    if (existing.expires_at < new Date()) {
      throw new Error("Refresh expired");
    }

    if (!existing) throw new Error("Refresh token revoked");

    // 🔥 DELETE old refresh token (rotation)
    await AdminRefreshToken.destroy({
      where: { token },
    });

    const { exp, iat, ...cleanPayload } = decoded;

    const newAccessToken = jwt.generateAccess(cleanPayload);
    const newRefreshToken = jwt.generateRefresh(cleanPayload);

    await AdminRefreshToken.create({
      user_id: cleanPayload.id,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 86400000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(token) {
    await AdminRefreshToken.destroy({
      where: { token },
    });
  },
};
