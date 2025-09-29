import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      const res = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("Signup successful. Redirecting to login...");
        setTimeout(() => nav("/"), 1500);
      } else {
        setStatusMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Signup failed. Check backend.");
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: 400, marginTop: "120px", margin: "60px auto" }}>
      <h2 style={{ textAlign: "center" }}>Signup</h2>

      {statusMessage && (
        <div
          className={`alert ${statusMessage.includes("successful") ? "alert-success" : "alert-error"}`}
          style={{ marginBottom: 15, textAlign: "center" }}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={submit} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large" style={{ display: "block", margin: "0 auto" }}>
          Signup
        </button>
      </form>
    </div>
  );
}
