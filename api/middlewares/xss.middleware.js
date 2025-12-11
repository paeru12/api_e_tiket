const xss = require("xss");

module.exports = function sanitize(req, res, next) {
  // Santize req.body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Santize req.query
  if (req.query && typeof req.query === "object") {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  next();
};
