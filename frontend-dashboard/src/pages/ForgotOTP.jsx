import "../styles/auth.css";

export default function ForgotOTP() {
  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Check Your Email</h1>
        <p className="subtitle">
          We sent a password reset link to your email. Open it to choose a new
          password.
        </p>
      </div>
    </div>
  );
}
