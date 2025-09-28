import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:5000";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [filter, setFilter] = useState("");
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
      alert("Failed to fetch products. Check backend.");
    }
  };

  const fetchCats = async () => {
    try {
      const res = await fetch(API + "/categories");
      const data = await res.json();
      setCats(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to fetch categories. Check backend.");
    }
  };

  const addToCart = async (product_id) => {
    if (!user) { 
      alert("Please login first"); 
      return; 
    }
    try {
      const res = await fetch(API + "/cart/", {  // ensure trailing slash
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customer_id: user.customer_id, 
          product_id, 
          quantity: 1 
        }),
      });
      const data = await res.json();
      if (data.success) alert("Added to cart");
      else alert(data.message || "Error adding to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to fetch. Check backend or network.");
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <div style={{ marginBottom: 10 }}>
        <select 
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

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {products.map(p => (
          <ProductCard key={p.product_id} p={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}
