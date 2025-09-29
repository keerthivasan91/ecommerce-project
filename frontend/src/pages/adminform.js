import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS

const API = "http://localhost:5000";

export default function AdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, data, productId } = location.state || {};
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState(
    data || {
      name: "",
      email: "",
      password: "",
      is_admin: 0,
      price: 0,
      stock: 0,
      category_id: null,
    }
  );

  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch categories for products
  useEffect(() => {
    if (type === "product") {
      fetch(`${API}/categories`)
        .then((res) => res.json())
        .then(setCategories)
        .catch(console.error);
    }
  }, [type]);

  // Fetch reviews if viewing product reviews
  useEffect(() => {
  if (type === "reviews" && productId) {
    fetch(`${API}/reviews/${productId}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(console.error);
  }
}, [type, productId]);


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
    } catch (err) {
      console.error(err);
      setStatusMessage("Action failed. Check backend.");
    }
  };

  if (!admin || !admin.is_admin)
    return <div style={{ color: "red" }}>Not authorized</div>;

  return (
    <div className="container page-container">
      {type === "reviews" && (
        <>
          <h2>Reviews for {data?.name || "Product"}</h2>
          {reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.review_id} className="review-card">
                <p><strong>{r.name}</strong> – Rating: {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}
          <button
            className="action-btn delete-btn"
            style={{ marginTop: 10 }}
            onClick={() => navigate("/admin")}
          >
            Back to Admin
          </button>
        </>
      )}

      {type !== "reviews" && (
        <>
          <h2>{data ? `Update ${type}` : `Add New ${type}`}</h2>

          {statusMessage && (
            <div
              className={`alert ${
                statusMessage.includes("successfully") ? "alert-success" : "alert-error"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-group">
            {/* Customer and Category Form */}
            {(type === "customer" || type === "category") && (
              <div className="form-group">
                <label className="form-label">Name:</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}

            {/* Customer Specific Fields */}
            {type === "customer" && (
              <>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    className="form-control"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input
                    className="form-control"
                    type="password"
                    value={form.password || ""}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin:</label>
                  <select
                    className="form-control"
                    value={form.is_admin}
                    onChange={(e) => setForm({ ...form, is_admin: Number(e.target.value) })}
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </>
            )}

            {/* Product Specific Fields */}
            {type === "product" && (
              <>
                <div className="form-group">
                  <label className="form-label">Name:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category:</label>
                  <select
                    className="form-control"
                    value={form.category_id || ""}
                    onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                    required
                  >
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

            {/* Submit & Cancel Buttons */}
            {type !== "reviews" && (
              <>
                <button type="submit" className="action-btn update-btn">
                  {data ? "Update" : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </button>
                <button
                  type="button"
                  className="action-btn delete-btn"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </button>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
}
