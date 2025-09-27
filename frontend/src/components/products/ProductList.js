import React, { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.product_id}>
            {p.name} - Rs.{p.price} ({p.quantity} in stock)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
