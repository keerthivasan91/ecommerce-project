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
  product_id INT AUTO_INCREMENT PRIMARY KEY,
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
  product_id INT,
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
  product_id INT,
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
  product_id INT,
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
INSERT INTO categories (category_id, name) VALUES
(1, 'Electronics'),
(2, 'Books'),
(3, 'Clothing'),
(4, 'Home Appliances'),
(5, 'Sports');

-- Insert products with manual IDs
INSERT INTO products (product_id, category_id, name, price, stock, description) VALUES
(1, 1, 'Wireless Mouse', 499.00, 50, 'Comfortable wireless mouse'),
(2, 1, 'Bluetooth Headphones', 1299.00, 30, 'Noise cancelling headphones'),
(3, 1, 'Smartphone', 15999.00, 25, 'Latest Android smartphone'),
(4, 2, 'Learn Python', 399.00, 100, 'Beginner-friendly Python book'),
(5, 2, 'Data Structures Book', 499.00, 80, 'Learn Data Structures effectively'),
(6, 3, 'Plain T-Shirt', 299.00, 80, 'Cotton tee'),
(7, 3, 'Jeans', 999.00, 40, 'Denim jeans for daily wear'),
(8, 4, 'Microwave Oven', 5499.00, 15, 'Compact microwave oven'),
(9, 4, 'Blender', 1999.00, 20, 'High-speed blender'),
(10, 5, 'Football', 799.00, 60, 'Standard size football for sports'),
(11, 4, 'Samsung Smart TV 55 inch', 49000.00, 10, '55 inch 4K Smart TV'),
(12, 1, 'Gaming Console', 29999.00, 5, 'Latest generation gaming console');

