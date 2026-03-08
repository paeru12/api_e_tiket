const jwt = require("jsonwebtoken");

module.exports = {
  generateAccess(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  },

  verifyAccess(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};