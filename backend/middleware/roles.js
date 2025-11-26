// backend/middleware/roles.js

module.exports = function role(requiredRole) {
  return function (req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden — insufficient role" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};
