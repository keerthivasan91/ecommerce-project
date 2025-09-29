import React from "react";

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="card">
      <div className="product-title">{p.name}</div>
      <div className="product-description">
        Category: {p.category || "—"}
      </div>
      <div className="product-price">₹{p.price}</div>
      <div className="product-description" style={{ marginBottom: '12px' }}>
        Stock: {p.stock}
      </div>
      <button 
        className="btn btn-primary" 
        onClick={() => onAdd(p.product_id)}
        disabled={p.stock === 0}
      >
        {p.stock === 0 ? 'Out of Stock' : 'Add to cart'}
      </button>
    </div>
  );
}