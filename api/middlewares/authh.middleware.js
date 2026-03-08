const jwt = require("../../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        code: "NO_TOKEN",
        message: "Unauthenticated",
      });
    }

    const decoded = jwt.verifyAccess(token);

    // WAJIB: minimal payload valid
    if (!decoded?.id || !decoded?.email) {
      return res.status(401).json({
        status: false,
        code: "INVALID_TOKEN",
        message: "Unauthenticated",
      });
    }

    req.user = decoded;
    req.tokenExp = decoded.exp;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        code: "TOKEN_EXPIRED",
        message: "Access token expired",
      });
    }

    return res.status(401).json({
      status: false,
      code: "INVALID_TOKEN",
      message: "Unauthenticated",
    });
  }
};
