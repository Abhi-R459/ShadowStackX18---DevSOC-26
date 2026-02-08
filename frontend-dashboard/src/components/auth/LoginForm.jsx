import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const roleToPath = {
  manager: "/manager",
  agent: "/agent",
  customer: "/customer",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const from = location.state?.from?.pathname;
      const result = await login(email, password);
      const effectiveRole = result.role || role || "customer";
      const fallback = roleToPath[effectiveRole] || "/customer";
      navigate(from || fallback, { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="login-card"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <h1>Welcome Back</h1>

      <p className="subtitle">
        Financial Conversation Intelligence System
      </p>

      <div className="form-group">
        <label>EMAIL</label>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <motion.button
        className="primary-btn"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing in…" : "Sign In"}
      </motion.button>

      <div className="login-footer">
        <span onClick={() => navigate("/forgot")}>Forgot password?</span>
        <span className="footer-sep"> · </span>
        <span onClick={() => navigate("/signup")}>Create account</span>
      </div>
    </motion.div>
  );
}
