import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../App.css";

const API = "http://localhost:5000";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const { productName } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (productName) {
      fetchProductByName(productName);
    } else {
      fetchProducts();
      fetchCats();
    }
  }, [productName]);

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

  const fetchProductByName = async (name) => {
    try {
      const res = await fetch(`${API}/products/${name}`);
      if (!res.ok) {
        setProducts([]);
        setMessage({ type: "error", text: "Product not found" });
        return;
      }
      const data = await res.json();
      setProducts([data]);
      setMessage(null);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setMessage({ type: "error", text: "Error fetching product" });
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
          quantity: 1,
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
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.q.value.trim();
    if (searchTerm.trim() && searchTerm.length > 0) {
      navigate(`/products/${encodeURIComponent(searchTerm)}`);
    }
    else {
      navigate("/home");
    }
  };

  return (
    <div className="container">
      {/* Heading + Search Bar */}
      <div className="products-header">
        <h2>{productName ? `Search Results for "${productName}"` : "Products"}</h2>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            id="search-query"
            name="q"
            placeholder="Search products..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>

      {/* Message Box */}
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      {/* Category Filter (only when not searching) */}
      {!productName && (
        <div className="form-group">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            className="form-control"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              fetchProducts(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {cats.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Product Cards */}
      <div className="cards-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <ProductCard key={p.product_id} p={p} desc={p.description} onAdd={addToCart} />
          ))
        )}
      </div>
    </div>
  );
}
