import { useNavigate, useParams } from "react-router-dom";
import "../styles/auth.css";

export default function ResetPassword() {
  const { role } = useParams();
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <div className="login-card">
        <h1>Create New Password</h1>

        <div className="form-group">
          <label>NEW PASSWORD</label>
          <input type="password" />
        </div>

        <div className="form-group">
          <label>CONFIRM PASSWORD</label>
          <input type="password" />
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate(`/login/${role}`)}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}