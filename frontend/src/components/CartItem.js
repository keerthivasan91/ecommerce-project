import React from "react";

export default function CartItem({ item, onRemove }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: 10,
      marginBottom: 10,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <h4>{item.name}</h4>
        <div>Price: ₹{item.price}</div>
        <div>Quantity: {item.quantity}</div>
      </div>
      <button onClick={() => onRemove(item.cart_id)}>Remove</button>
    </div>
  );
}
