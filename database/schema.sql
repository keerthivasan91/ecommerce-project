-- create database if not exists
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  is_admin TINYINT DEFAULT 0
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  product_id VARCHAR(10) PRIMARY KEY,
  category_id INT,
  name VARCHAR(150),
  price DECIMAL(10,2),
  stock INT,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  product_id VARCHAR(10),
  quantity INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) DEFAULT 'placed',
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id VARCHAR(10),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2),
  method VARCHAR(30),
  status VARCHAR(30),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  product_id VARCHAR(10),
  rating INT,
  comment TEXT,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Insert a default admin (change password if you want)
INSERT IGNORE INTO customers (name, email, password, is_admin)
VALUES ('Admin', 'admin@ecommerce.com', 'admin123', 1);

-- Insert categories with manual IDs