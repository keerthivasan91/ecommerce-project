-- create database if not exists
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
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
INSERT IGNORE INTO categories (category_id, name) VALUES
(1, 'Electronics'),
(2, 'Books'),
(3, 'Clothing'),
(4, 'Home & Kitchen'),
(5, 'Sports & Outdoors');
-- Insert products with manual IDs
INSERT IGNORE INTO products (product_id, category_id, name, price, stock, description) VALUES
('P001', 1, 'Smartphone', 699.99, 50, 'Latest model smartphone with advanced features.'),
('P002', 1, 'Laptop', 999.99, 30, 'High-performance laptop for work and gaming.'),
('P003', 2, 'Fiction Book', 19.99, 100, 'Bestselling fiction book by a renowned author.'),
('P004', 2, 'Science Book', 29.99, 80, 'Informative science book for enthusiasts.'),
('P005', 3, 'T-Shirt', 15.99, 200, 'Comfortable cotton t-shirt available in various sizes.'),
('P006', 3, 'Jeans', 49.99, 150, 'Stylish denim jeans with a perfect fit.'),
('P007', 4, 'Blender', 59.99, 40, 'High-speed blender for smoothies and more.'),
('P008', 4, 'Cookware Set', 89.99, 25, 'Durable cookware set for all your cooking needs.'),
('P009', 5, 'Yoga Mat', 25.99, 70, 'Non-slip yoga mat for all types of exercises.'),
('P010', 5, 'Dumbbell Set', 79.99, 60, 'Adjustable dumbbell set for strength training.');

-- Prevent insertion if rating is outside 1-5 range
DELIMITER $$
CREATE TRIGGER validate_review_rating
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
END$$
DELIMITER ;