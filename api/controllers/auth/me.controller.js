const { User } = require("../../../models");

module.exports = async (req, res) => {
  console.log("COOKIE: ", req.cookies);
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const img = user.image
      ? process.env.MEDIA_URL_AUTH + user.image
      : null;

    res.json({
      status: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        img,
        creator_id: req.user.creator_id,
        globalRoles: req.user.globalRoles,
        creatorRoles: req.user.creatorRoles,
      },
      exp: req.tokenExp,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed fetch user",
    });
  }
};
