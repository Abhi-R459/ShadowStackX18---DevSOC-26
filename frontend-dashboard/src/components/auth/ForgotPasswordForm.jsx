import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  function getForgotPasswordErrorMessage(code) {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Failed to send reset email. Please try again.";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await resetPassword(email);
      setMessage("Check your email for a link to reset your password. If you don't see it, check your spam folder.");
    } catch (err) {
      setError(err.message || getForgotPasswordErrorMessage(err.code) || "Failed to send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-card">
      <h1>Forgot Password</h1>
      <p className="subtitle">Enter your email to receive a reset link</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        <div className="form-group">
          <label>EMAIL</label>
          <input
            type="email"
            placeholder="analyst@bank.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <div className="login-footer">
        <Link to="/login">Back to sign in</Link>
      </div>
    </div>
  );
}
