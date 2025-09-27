# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## User Endpoints

### Register User
```http
POST /users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "555-1234",
  "address": "123 Main St"
}
```

### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "555-5678",
  "address": "456 Oak Ave"
}
```

### Get All Users (Admin Only)
```http
GET /users/
Authorization: Bearer <admin_token>
```

## Product Endpoints

### Get All Products
```http
GET /products/
Query Parameters:
- search: Search term
- category_id: Filter by category
```

### Get Product by ID
```http
GET /products/{product_id}
```

### Create Product (Admin Only)
```http
POST /products/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "quantity": 50,
  "category_id": 1
}
```

### Update Product (Admin Only)
```http
PUT /products/{product_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1099.99
}
```

### Delete Product (Admin Only)
```http
DELETE /products/{product_id}
Authorization: Bearer <admin_token>
```

## Category Endpoints

### Get All Categories
```http
GET /categories/
```

### Get Category by ID
```http
GET /categories/{category_id}
```

### Create Category (Admin Only)
```http
POST /categories/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices",
  "parent_category_id": null
}
```

### Update Category (Admin Only)
```http
PUT /categories/{category_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Smart Electronics",
  "description": "Smart electronic devices"
}
```

### Delete Category (Admin Only)
```http
DELETE /categories/{category_id}
Authorization: Bearer <admin_token>
```

## Cart Endpoints

### Get Cart
```http
GET /cart/
Authorization: Bearer <token>
```

### Add Item to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "cart_item_id": 1,
  "quantity": 3
}
```

### Remove Item from Cart
```http
DELETE /cart/remove/{cart_item_id}
Authorization: Bearer <token>
```

### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <token>
```

### Get Cart Count
```http
GET /cart/count
Authorization: Bearer <token>
```

## Order Endpoints

### Get User Orders
```http
GET /orders/
Authorization: Bearer <token>
```

### Get Order by ID
```http
GET /orders/{order_id}
Authorization: Bearer <token>
```

### Create Order
```http
POST /orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address": "123 Main St, City, State 12345"
}
```

### Update Order Status (Admin Only)
```http
PUT /orders/{order_id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### Cancel Order
```http
PUT /orders/{order_id}/cancel
Authorization: Bearer <token>
```

### Get All Orders (Admin Only)
```http
GET /orders/all
Authorization: Bearer <admin_token>
```

## Payment Endpoints

### Get User Payments
```http
GET /payments/
Authorization: Bearer <token>
```

### Get Payment by ID
```http
GET /payments/{payment_id}
Authorization: Bearer <token>
```

### Create Payment
```http
POST /payments/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 1
}
```

### Process Payment
```http
POST /payments/{payment_id}/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_method": "credit_card"
}
```

### Refund Payment (Admin Only)
```http
POST /payments/{payment_id}/refund
Authorization: Bearer <admin_token>
```

### Get All Payments (Admin Only)
```http
GET /payments/all
Authorization: Bearer <admin_token>
```

## Review Endpoints

### Get All Reviews
```http
GET /reviews/
Query Parameters:
- product_id: Filter by product
```

### Get Review by ID
```http
GET /reviews/{review_id}
```

### Create Review
```http
POST /reviews/
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

### Update Review
```http
PUT /reviews/{review_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

### Delete Review
```http
DELETE /reviews/{review_id}
Authorization: Bearer <token>
```

### Get Product Reviews
```http
GET /reviews/product/{product_id}
```

### Get User Reviews
```http
GET /reviews/user
Authorization: Bearer <token>
```

### Get Product Review Stats
```http
GET /reviews/stats/{product_id}
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Order Status Values
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed, processing
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## Payment Status Values
- `pending` - Payment initiated
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded
