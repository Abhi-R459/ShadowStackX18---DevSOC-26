import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Map role -> default dashboard path
const roleToPath = {
  manager: "/manager",
  agent: "/agent",
  customer: "/customer",
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, profileLoading, role } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="login-page">
        <div className="auth-loading">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/enter" state={{ from: location }} replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect explicitly to unauthorized page for better UX and auditing
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
