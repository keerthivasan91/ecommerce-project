import React from "react";
import ProductList from "./components/products/ProductList";
import UserList from "./components/users/UserList";

function App() {
  return (
    <div>
      <h1>E-commerce Frontend</h1>
      <UserList />
      <ProductList />
    </div>
  );
}

export default App;
