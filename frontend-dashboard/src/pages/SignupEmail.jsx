import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

export default function SignupEmail() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, role || "customer");
      navigate(`/signup/${role}/verify`, { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Enter your email to get a verification link</p>

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
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>CONFIRM PASSWORD</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending link…" : "Send verification link"}
        </button>
      </div>
    </div>
  );
}
