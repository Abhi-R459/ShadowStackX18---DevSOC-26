import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/auth.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Welcome</h1>
        <p className="subtitle">Sign in or create an account to continue</p>

        <motion.button
          className="primary-btn"
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05 }}
        >
          Sign In
        </motion.button>

        <motion.button
          className="secondary-btn"
          onClick={() => navigate("/signup")}
          whileHover={{ scale: 1.05 }}
          style={{ marginTop: "1rem" }}
        >
          Create Account
        </motion.button>
      </motion.div>
    </div>
  );
}
