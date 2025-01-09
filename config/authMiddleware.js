module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "you are not authorized to view this resource" });
  }
};

module.exports.isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membership_status) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "you are not authorized to view this resource" });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).json({
      msg: "you are not authorized to view this resource because you are not a admin.",
    });
  }
};
