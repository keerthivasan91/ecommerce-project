import React from "react";

export default function ProductCard({ p, onAdd }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 10, width: 240 }}>
      <h4>{p.name}</h4>
      <div>Category: {p.category || "—"}</div>
      <div>Price: ₹{p.price}</div>
      <div>Stock: {p.stock}</div>
      <div style={{ marginTop: 8 }}>
        <button onClick={() => onAdd(p.product_id)}>Add to cart</button>
      </div>
    </div>
  );
}
