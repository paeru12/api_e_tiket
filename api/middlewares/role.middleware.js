module.exports = function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return res.status(403).json({
        status: false,
        message: "Access denied"
      });
    }

    next();
  };
};
