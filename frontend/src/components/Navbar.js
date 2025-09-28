import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ padding: 10, background: "#eee", display: "flex", gap: 10 }}>
      <Link to="/home">Home</Link>
      {user && <Link to="/cart">Cart</Link>}
      {user && user.is_admin && <Link to="/admin">Admin</Link>}
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
