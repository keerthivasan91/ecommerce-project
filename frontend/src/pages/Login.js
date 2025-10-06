import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        const user = {
          customer_id: data.customer_id,
          name: data.name,
          email: email,
          password: password, // store password for admin API calls
          is_admin: data.is_admin,
        };
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate based on admin status
        if (data.is_admin) {
          nav("/admin");
        } else {
          nav("/home");
        }
      } else {
        setStatusMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Login failed. Check backend.");
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: 400, marginTop: "120px", margin: "130px auto" }}>
      <h2>Login</h2>

      {statusMessage && (
        <div
          className={`alert ${
            statusMessage.includes("failed") ? "alert-error" : "alert-success"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={submit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large" style={{ display: "block", margin: "0 auto" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: 20 , textAlign: "center" }}>
        Don't have an account? <a style={{ color: "#e74c3c" }} href="/signup">Sign up</a>
      </p>
    </div>
  );
}
