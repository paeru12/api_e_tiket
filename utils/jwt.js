const jwt = require("jsonwebtoken");

module.exports = {
  generateAccess: (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
      issuer: "api-eticket",
    }),

  generateRefresh: (id) =>
    jwt.sign({ id }, process.env.JWT_REFRESH, {
      expiresIn: "7d",
      issuer: "api-eticket",
    }),

  verifyAccess: (token) => jwt.verify(token, process.env.JWT_SECRET),

  verifyRefresh: (token) => jwt.verify(token, process.env.JWT_REFRESH),
};
