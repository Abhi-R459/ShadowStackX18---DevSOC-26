import React from "react";
import "../styles/auth.css";

export default function Unauthorized() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
