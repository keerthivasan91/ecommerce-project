import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Only allow if user exists and username is 'admin'
  if (!user || user.username !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
