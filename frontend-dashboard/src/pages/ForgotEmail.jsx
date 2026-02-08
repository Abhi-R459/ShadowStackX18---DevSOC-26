import "../styles/auth.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ForgotEmail() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Password reset link sent. Check your email.");
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Reset Password</h1>
        <p className="subtitle">Enter your registered email</p>

        {message && <div className="auth-success">{message}</div>}
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

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </div>
    </div>
  );
}
