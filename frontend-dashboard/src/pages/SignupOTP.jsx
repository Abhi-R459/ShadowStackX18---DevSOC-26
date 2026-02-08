import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

export default function SignupOTP() {
  const navigate = useNavigate();
  const { user, sendVerification, reloadUser, signOut } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleResend() {
    if (!user) return;
    setError("");
    setMessage("");
    setResending(true);
    try {
      await sendVerification(user);
      setMessage("Verification link sent. Check your inbox (and spam).");
    } catch (err) {
      setError(err.message || "Failed to send link.");
    } finally {
      setResending(false);
    }
  }

  async function handleCheck() {
    if (!user) return;
    setError("");
    setMessage("");
    setChecking(true);
    try {
      await reloadUser(user);
      if (user.emailVerified) {
        setMessage("Email verified! Redirecting…");
        setTimeout(() => navigate("/enter", { replace: true }), 600);
      } else {
        setMessage("Not verified yet. Click the link in your email.");
      }
    } catch (err) {
      setError(err.message || "Could not refresh verification status.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Verify Email</h1>
        <p className="subtitle">
          We sent a verification link to your email. Click it to complete
          signup.
        </p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <div className="verify-email-actions single">
          <button
            className="primary-btn"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending…" : "Resend link"}
          </button>
        </div>

        <div className="login-footer">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCheck}
            disabled={checking}
          >
            {checking ? "Checking…" : "Refresh status"}
          </button>
          <span onClick={() => signOut()}>Use a different email</span>
        </div>
      </div>
    </div>
  );
}
