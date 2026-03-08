module.exports.globalGuard = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.globalRoles) {
      return res.status(403).json({ status: false, message: "Forbidden" });
    }

    const hasRole = user.globalRoles.some(r => allowedRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({
        status: false,
        message: "Insufficient global role"
      });
    }

    next();
  };
};

module.exports.creatorGuard = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.creatorRoles) {
      return res.status(403).json({ status: false, message: "Forbidden" });
    }

    const hasRole = user.creatorRoles.some(r => allowedRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({
        status: false,
        message: "Insufficient creator role"
      });
    }

    next();
  };
};

module.exports.creatorAccessGuard = () => {
  return (req, res, next) => {
    const user = req.user;
    const creatorIdFromParam = req.params.creatorId;

    // SUPERADMIN boleh akses semua
    if (user.globalRoles?.includes("SUPERADMIN")) {
      return next();
    }

    if (!user.creator_id) {
      return res.status(403).json({
        status: false,
        message: "This account is not part of any creator"
      });
    }

    if (user.creator_id !== creatorIdFromParam) {
      return res.status(403).json({
        status: false,
        message: "You are not allowed to access this creator"
      });
    }

    next();
  };
};

module.exports.mixedGuard = (globalRoles = [], creatorRoles = []) => {
  return (req, res, next) => {
    const user = req.user;

    // Cek global
    const hasGlobal = user.globalRoles?.some(r => globalRoles.includes(r));

    // Cek creator
    const hasCreator = user.creatorRoles?.some(r => creatorRoles.includes(r));

    if (!hasGlobal && !hasCreator) {
      return res.status(403).json({
        status: false,
        message: "You don't have permission"
      });
    }

    next();
  };
};
