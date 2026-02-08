import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (email.endsWith("@manager.company.com")) {
      navigate("/manager");
    } else if (email.endsWith("@agent.company.com")) {
      navigate("/agent");
    } else {
      navigate("/customer");
    }
  };

  return (
    <motion.div
      className="login-card"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <h1>Welcome Back</h1>

      <p className="subtitle">
        Financial Conversation Intelligence System
      </p>

      <div className="form-group">
        <label>EMAIL</label>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>PASSWORD</label>
        <input type="password" placeholder="••••••••" />
      </div>

      <motion.button
        className="primary-btn"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleLogin}
      >
        Sign In
      </motion.button>

      <div className="login-footer">
        Forgot password?
      </div>
    </motion.div>
  );
}