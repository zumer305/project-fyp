const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    // Allow passport session users
    if (req.isAuthenticated && req.isAuthenticated()) {
      const u = req.user;
      req.user = { id: (u._id || u.id || u).toString(), role: u.role || "user" };
      return next();
    }

    // Fallback to JWT
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };