import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      alert("Signup successful. Please login.");
      nav("/");
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div><input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
