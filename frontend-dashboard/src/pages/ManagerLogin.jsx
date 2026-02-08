import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

export default function ManagerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/manager", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Manager Login</h1>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="primary-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="login-actions">
          <span onClick={() => navigate("/signup/manager")}>Create Account</span>
          <span onClick={() => navigate("/forgot/manager")}>
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}
