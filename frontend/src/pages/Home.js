import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null); // <-- New state for messages
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchProducts();
    fetchCats();
  }, []);

  const fetchProducts = async (category_id) => {
    try {
      let url = API + "/products";
      if (category_id) url += "?category_id=" + category_id;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setMessage({ type: "error", text: "Failed to fetch products. Check backend." });
    }
  };

  const fetchCats = async () => {
    try {
      const res = await fetch(API + "/categories");
      const data = await res.json();
      setCats(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setMessage({ type: "error", text: "Failed to fetch categories. Check backend." });
    }
  };

  const addToCart = async (product_id) => {
    if (!user) { 
      setMessage({ type: "error", text: "Please login first" });
      return; 
    }
    try {
      const res = await fetch(API + "/cart/", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customer_id: user.customer_id, 
          product_id, 
          quantity: 1 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Added to cart" });
      } else {
        setMessage({ type: "error", text: data.message || "Error adding to cart" });
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage({ type: "error", text: "Failed to fetch. Check backend or network." });
    }

    // Hide message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container">
      <h2>Products</h2>

      {/* Message Box */}
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          className="form-control"
          value={filter}
          onChange={e => { 
            setFilter(e.target.value); 
            fetchProducts(e.target.value); 
          }}
        >
          <option value="">All Categories</option>
          {cats.map(c => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="cards-grid">
        {products.length === 0 ? <p>No products found.</p> : products.map(p => (
          <ProductCard key={p.product_id} p={p} desc={p.description} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}
