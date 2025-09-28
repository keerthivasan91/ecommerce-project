import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const API = "http://localhost:5000";

export default function Cart() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch(API + "/cart/" + user.customer_id);
    const data = await res.json();
    setItems(data);
  };

  const remove = async (cart_id) => {
    const res = await fetch(API + "/cart/" + cart_id, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchCart();
    else alert(data.message || "Error");
  };

  const checkout = async () => {
    const res = await fetch(API + "/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: user.customer_id })
    });
    const data = await res.json();
    if (data.success) {
      nav("/payment", { state: { order_id: data.order_id } });
    } else {
      alert(data.message || "Checkout failed");
    }
  };

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {items.length === 0 && <div>Cart is empty</div>}
      {items.map(it => (
        <CartItem key={it.cart_id} item={it} onRemove={remove} />
      ))}
      {items.length > 0 && (
        <>
          <div>Total: ₹{total.toFixed(2)}</div>
          <button onClick={checkout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}
