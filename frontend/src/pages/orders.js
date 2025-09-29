import React, { useEffect, useState } from "react";
import "../App.css";
const API = "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/orders/user/${user.customer_id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []); // <-- Empty array ensures fetch runs only once

  return (
    <div className="container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <div key={o.order_id} className="order-card">
              <h4>Order ID: {o.order_id}</h4>
              <p><strong>Date:</strong> {o.date_created}</p>
              <ul>
                {o.items.map((item) => (
                  <li key={item.order_item_id}>
                    {item.name} - Qty: {item.quantity} - ₹{item.price}
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
