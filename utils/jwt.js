const jwt = require("jsonwebtoken");

module.exports = {
  generateAccess(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },

  generateRefresh(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d"
    });
  },

  verifyAccess(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  verifyRefresh(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }
};
