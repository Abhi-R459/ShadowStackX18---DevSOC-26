import SignUpForm from "../components/auth/SignUpForm";
import "../styles/auth.css";

export default function SignUp() {
  return (
    <div className="login-page">
      <div className="background-layer"></div>
      <SignUpForm />
    </div>
  );
}
