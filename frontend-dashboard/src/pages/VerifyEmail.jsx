import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
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
      setMessage("Verification email sent. Check your inbox (and spam folder).");
    } catch (err) {
      setError(
        err.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : err.message || "Failed to send email."
      );
    } finally {
      setResending(false);
    }
  }

  async function handleCheckVerified() {
    if (!user) return;
    setError("");
    setMessage("");
    setChecking(true);
    try {
      await reloadUser(user);
      // Firebase updates the user object in place; emailVerified may now be true
      if (user.emailVerified) {
        setMessage("Email verified! Redirecting…");
        // Redirect to role-specific entry after short delay
        setTimeout(() => {
          window.location.href = "/enter";
        }, 600);
      } else {
        setMessage("Not verified yet. Click the link in the email we sent you.");
      }
    } catch (err) {
      setError(err.message || "Could not check verification status.");
    } finally {
      setChecking(false);
    }
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="background-layer" />
        <div className="login-card">
          <p className="subtitle">Please sign in to verify your email.</p>
          <div className="login-footer">
            <Link to="/login">Go to sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.emailVerified) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="background-layer" />
      <div className="login-card">
        <h1>Confirm your email</h1>
        <p className="subtitle">
          We sent a verification link to <strong>{user.email}</strong>. Click
          the link in that email to verify your account.
        </p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <div className="verify-email-actions single">
          <button
            type="button"
            className="primary-btn"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending…" : "Resend verification email"}
          </button>
        </div>

        <div className="login-footer">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCheckVerified}
            disabled={checking}
          >
            {checking ? "Checking…" : "Refresh status"}
          </button>
          <Link to="/login" onClick={() => signOut()}>
            Sign out and use a different account
          </Link>
        </div>

      </div>
    </div>
  );
}
