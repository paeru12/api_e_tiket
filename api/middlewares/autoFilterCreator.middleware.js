module.exports.autoFilterByCreator = () => {
  return (req, res, next) => {
    const user = req.user;

    // SUPERADMIN bypass semua creator filter
    if (user.globalRoles?.includes("SUPERADMIN")) {
      req.filterCreator = null; 
      return next();
    }

    if (!user.creator_id) {
      return res.status(403).json({
        status: false,
        message: "Creator access required"
      });
    }

    req.filterCreator = user.creator_id;

    next();
  };
};
