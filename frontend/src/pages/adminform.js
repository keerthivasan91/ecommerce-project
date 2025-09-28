import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function AdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, data } = location.state || {};
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState(data || { name: "", email: "", is_admin: 0, price: 0, stock: 0, category_id: null });
  const [categories, setCategories] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (type === "product") {
      fetch(`${API}/categories`)
        .then((res) => res.json())
        .then(setCategories)
        .catch(console.error);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const typeMap = { customer: "customers", product: "products", category: "categories" };
      let url = `${API}/${typeMap[type]}`;
      let method = "POST";

      if (data && data[`${type}_id`]) {
        url += `/${data[`${type}_id`]}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, admin_email: admin.email, admin_password: admin.password }),
      });

      const result = await res.json();
      setStatusMessage(result.success ? `${type} saved successfully` : result.message);
      if (result.success) navigate("/admin");
    } catch {
      setStatusMessage("Action failed. Check backend.");
    }
  };

  return (
    <div className="container">
      <h2>{data ? `Update ${type}` : `Add New ${type}`}</h2>
      {statusMessage && <div style={{ color: statusMessage.includes("successfully") ? "green" : "red", marginBottom: 10 }}>{statusMessage}</div>}

      <form onSubmit={handleSubmit}>
        {(type === "customer" || type === "category") && (
          <div>
            <label>Name:</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
        )}

        {type === "customer" && (
          <>
            <div>
              <label>Email:</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label>Admin:</label>
              <select value={form.is_admin} onChange={(e) => setForm({ ...form, is_admin: Number(e.target.value) })}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </>
        )}

        {type === "product" && (
          <>
            <div>
              <label>Name:</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label>Price:</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div>
              <label>Stock:</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
            </div>
            <div>
              <label>Category:</label>
              <select value={form.category_id || ""} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button type="submit">{data ? "Update" : "Add"}</button>
        <button type="button" onClick={() => navigate("/admin")} style={{ marginLeft: 10 }}>Cancel</button>
      </form>
    </div>
  );
}
    