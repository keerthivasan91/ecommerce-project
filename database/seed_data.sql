USE ecommerce_db;

-- Insert a default admin user
INSERT INTO User (username, email, password) 
VALUES ('admin', 'admin@ecommerce.com', 'admin123');

INSERT INTO Admin (user_id, name) VALUES 
(1, 'System Administrator');

-- Insert a sample customer
INSERT INTO User (username, email, password) 
VALUES ('john_doe', 'john@example.com', 'password123');

INSERT INTO Customer (user_id, name, phone, address) VALUES 
(2, 'John Doe', '9876543210', '123, Sample Street, City');

-- Insert categories
INSERT INTO Category (name, description) VALUES
('Electronics', 'Devices and gadgets'),
('Clothing', 'Men and Women wear');

-- Insert products (admin manages them)
INSERT INTO Product (name, description, price, quantity, category_id, admin_id) VALUES
('Laptop', 'Dell Inspiron 15', 55000, 10, 1, 1),
('T-Shirt', 'Blue Cotton T-shirt', 500, 20, 2, 1);

-- Insert cart for the customer
INSERT INTO Cart (customer_id) VALUES (1);

-- Insert cart items
INSERT INTO Cart_Item (cart_id, product_id, quantity) VALUES
(1, 1, 1);

-- Insert an order for the customer
INSERT INTO `Order` (customer_id, total_amount, shipping_address, order_status) VALUES
(1, 55500, '123, Sample Street, City', 'confirmed');

-- Insert order items
INSERT INTO Order_Item (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 55000),
(1, 2, 1, 500);

-- Insert a payment
INSERT INTO Payment (order_id, amount, payment_status) VALUES
(1, 55500, 'completed');

-- Insert a review
INSERT INTO Review (customer_id, product_id, rating, comment) VALUES
(1, 1, 5, 'Great laptop! Works very smoothly.');
