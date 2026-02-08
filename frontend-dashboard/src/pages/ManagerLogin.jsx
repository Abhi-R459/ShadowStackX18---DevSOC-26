import { Navigate } from "react-router-dom";

// Legacy route: redirect to the unified login
export default function ManagerLogin() {
  return <Navigate to="/login" replace />;
}
