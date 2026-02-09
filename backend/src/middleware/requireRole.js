// requireRole middleware factory
// Ensures `req.user.role` (set by verifyToken) matches one of the allowed roles.
export default function requireRole(...allowed) {
  const allowedSet = new Set(allowed);
  return (req, res, next) => {
    try {
      const role = req.user && req.user.role;
      if (!role) return res.status(403).json({ error: "Forbidden: no role assigned" });
      if (!allowedSet.has(role)) return res.status(403).json({ error: "Forbidden: insufficient role" });
      return next();
    } catch (err) {
      console.error("requireRole error:", err && err.message ? err.message : err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
