import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS

const API = "http://localhost:5000";

export default function Admin() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!admin || !admin.is_admin) return;
    if (!admin.password) {
      admin.password = "admin123";
      localStorage.setItem("user", JSON.stringify(admin));
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchCustomers(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
    ]);
    setLoading(false);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(
        `${API}/customers?admin_email=${admin.email}&admin_password=${admin.password}`
      );
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (url, refreshFn, successMsg) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const params = new URLSearchParams({
        admin_email: admin.email,
        admin_password: admin.password,
      }).toString();
      const res = await fetch(`${url}?${params}`, { method: "DELETE" });
      const data = await res.json();
      setStatusMessage(data.success ? successMsg : data.message);
      if (data.success && refreshFn) refreshFn();
    } catch (err) {
      console.error(err);
      setStatusMessage("Delete action failed");
    }
  };

  if (!admin || !admin.is_admin)
    return <div style={{ color: "red" }}>Not authorized</div>;
  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Customers */}
      <h3>
        Customers
        <button
          className="action-btn update-btn"
          style={{ marginLeft: 10 }}
          onClick={() =>
            navigate("/admin-form", { state: { type: "customer" } })
          }
        >
          Add New
        </button>
      </h3>
      {customers.length === 0 ? (
        <div>No customers found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.customer_id}>
                <td>{c.customer_id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.is_admin ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="action-btn update-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: { type: "customer", data: c },
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        `${API}/customers/${c.customer_id}`,
                        fetchCustomers,
                        "Customer deleted successfully"
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Products */}
      <h3>
        Products
        <button
          className="action-btn update-btn"
          style={{ marginLeft: 10 }}
          onClick={() =>
            navigate("/admin-form", { state: { type: "product" } })
          }
        >
          Add New
        </button>
      </h3>
      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
              <th>Reviews</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.name}</td>
                <td>{p.category || "-"}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="action-btn update-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: { type: "product", data: p },
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        `${API}/products/${p.product_id}`,
                        fetchProducts,
                        "Product deleted successfully"
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="action-btn review-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: {
                          type: "reviews",
                          productId: p.product_id,
                          data: p,
                        },
                      })
                    }
                  >
                    View Reviews
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Categories */}
      <h3>
        Categories
        <button
          className="action-btn update-btn"
          style={{ marginLeft: 10 }}
          onClick={() =>
            navigate("/admin-form", { state: { type: "category" } })
          }
        >
          Add New
        </button>
      </h3>
      {categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.category_id}>
                <td>{c.category_id}</td>
                <td>{c.name}</td>
                <td>
                  <button
                    className="action-btn update-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: { type: "category", data: c },
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        `${API}/categories/${c.category_id}`,
                        fetchCategories,
                        "Category deleted successfully"
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Orders */}
      <h3>Orders</h3>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <div key={o.order_id} className="order-card">
              <h4>Order ID: {o.order_id}</h4>
              <p>
                <strong>Customer ID:</strong> {o.customer_id}
              </p>
              <p>
                <p>
                  <strong>Date:</strong> {o.date_created}
                </p>
              </p>
              <h5>Items:</h5>
              <ul>
                {o.items.map((it) => (
                  <li key={it.order_item_id}>
                    {it.name} – Qty: {it.quantity} – ₹{it.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
