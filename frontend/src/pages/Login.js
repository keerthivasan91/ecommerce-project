import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        nav("/home");
      } else {
        setStatusMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Login failed. Check backend.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      {statusMessage && <div style={{ color: "red", marginBottom: 10 }}>{statusMessage}</div>}
      <form onSubmit={submit}>
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}