// api/middlewares/apikey.js
module.exports = function apiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  const allowedKeys = (process.env.API_KEYS_FEND || "").split(",").map(k => k.trim());

  // Logging minimal
  console.info(`[API-KEY CHECK] ${req.method} ${req.originalUrl} - Key: ${clientKey || "none"} - IP: ${req.ip}`);

  // No API keys configured
  if (!allowedKeys.length || allowedKeys[0] === "") {
    console.warn("⚠️  API_KEYS tidak diset — semua request akan ditolak."); 
    return res.status(500).json({ status: false, message: "API key not configured" });
  }


  // key missing
  if (!clientKey) {
    return res.status(401).json({ status: false, message: "API key missing" });
  }

  // key mismatch
  if (!allowedKeys.includes(clientKey)) {
    return res.status(403).json({ status: false, message: "Invalid API key" });
  }

  next();
};