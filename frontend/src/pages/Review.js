import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Review() {
  const { orderId } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Login required"); return; }
    const res = await fetch(API + "/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: user.customer_id,
        product_id: productId,
        rating,
        comment
      })
    });
    const data = await res.json();
    if (data.success) {
      alert("Thanks for the review");
      nav("/home");
    } else alert(data.message || "Failed");
  };

  return (
    <div>
      <h2>Review (optional)</h2>
      <div>Order ID: {orderId}</div>
      <form onSubmit={submit}>
        <div>
          <input placeholder="Product ID to review" value={productId} onChange={e => setProductId(e.target.value)} />
        </div>
        <div>
          <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
        </div>
        <div>
          <textarea placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
