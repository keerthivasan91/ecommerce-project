import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Payment() {
  const loc = useLocation();
  const nav = useNavigate();
  // order_id can be passed via state from Cart page or user can input
  const [orderId, setOrderId] = useState(loc.state?.order_id || "");
  const [method, setMethod] = useState("cash");
  const [amount, setAmount] = useState("");

  const pay = async (e) => {
    e.preventDefault();
    if (!orderId) { alert("Order ID required"); return; }
    const res = await fetch(API + "/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, amount: amount || 0, method, status: "success" })
    });
    const data = await res.json();
    if (data.success) {
      alert("Payment successful");
      // redirect to review with order id
      nav(`/review/${orderId}`);
    } else alert(data.message || "Payment failed");
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={pay}>
        <div>
          <input placeholder="Order ID" value={orderId} onChange={e => setOrderId(e.target.value)} />
        </div>
        <div>
          <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>
        <button type="submit">Pay</button>
      </form>
    </div>
  );
}
