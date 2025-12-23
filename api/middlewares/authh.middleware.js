const jwt = require("../../utils/jwt");

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verifyAccess(token);
    req.user = decoded; // { id, roles }
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};
