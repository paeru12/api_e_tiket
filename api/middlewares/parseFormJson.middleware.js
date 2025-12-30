module.exports = (fields = []) => (req, res, next) => {
  try {
    for (const field of fields) {
      if (typeof req.body[field] === "string") {
        req.body[field] = JSON.parse(req.body[field]);
      }
    }
    next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "Invalid JSON format",
      error: err.message,
    });
  }
};
