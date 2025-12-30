const service = require("../../services/auth/adminAuth.service");

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password, req);

      res.json({
        status: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        data: result.user
      });
    } catch (err) {
      res.status(401).json({ status: false, message: err.message });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await service.refresh(refreshToken);
      res.json({ status: true, accessToken: result.accessToken });
    } catch {
      res.status(401).json({ status: false, message: "Invalid refresh token" });
    }
  },

  async logout(req, res) {
    const { refreshToken } = req.body;
    await service.logout(refreshToken);

    res.json({
      status: true,
      message: "Logged out"
    });
  }
};
