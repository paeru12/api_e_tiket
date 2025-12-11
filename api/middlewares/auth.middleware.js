const jwt = require("../../utils/jwt");
const logger = require("../../config/logger");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const decoded = jwt.verifyAccess(token);
    req.user = decoded;

    next();
  } catch (err) {
    logger.warn("JWT validation failed");
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};
