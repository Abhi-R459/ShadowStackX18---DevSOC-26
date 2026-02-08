import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Reset Password</h1>

        <p className="subtitle">
          Enter your email to receive a verification code
        </p>

        <div className="form-group">
          <label>EMAIL</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/verify-code")}
        >
          Send Code
        </button>
      </div>
    </div>
  );
}