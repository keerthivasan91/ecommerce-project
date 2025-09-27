# E-commerce Project Overview

## Project Description

This is a full-stack e-commerce application built with modern web technologies. The project consists of a Flask-based REST API backend and a React.js frontend, providing a complete online shopping experience.

## Features

### Core Features
- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/Customer)
  - Profile management

- **Product Management**
  - Product catalog with search and filtering
  - Category management with hierarchical structure
  - Product CRUD operations (Admin only)
  - Product reviews and ratings

- **Shopping Cart**
  - Add/remove items from cart
  - Update quantities
  - Persistent cart across sessions
  - Real-time cart count

- **Order Management**
  - Order creation from cart
  - Order tracking and status updates
  - Order history for customers
  - Admin order management

- **Payment Processing**
  - Payment creation and processing
  - Payment status tracking
  - Refund management (Admin)
  - Payment history

- **Review System**
  - Product reviews and ratings
  - Review statistics
  - Customer review management

### Admin Features
- User management
- Product and category management
- Order status updates
- Payment management
- Review moderation

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Custom database models
- **CORS**: Flask-CORS for cross-origin requests

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **UI Library**: React Bootstrap
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Notifications**: React Toastify

### Database
- **Database**: MySQL
- **Schema**: Relational database with proper foreign keys
- **Indexes**: Optimized for performance

## Architecture

### Backend Architecture
```
backend/
├── app.py              # Main Flask application
├── config.py           # Database configuration
├── models.py           # Database models and ORM
├── routes/             # API route handlers
│   ├── users.py        # User management
│   ├── products.py     # Product management
│   ├── categories.py   # Category management
│   ├── cart.py         # Shopping cart
│   ├── orders.py       # Order management
│   ├── payments.py     # Payment processing
│   └── reviews.py      # Review system
├── utils/              # Utility functions
│   ├── database.py     # Database connection
│   └── helpers.py      # Helper functions
└── requirements.txt    # Python dependencies
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── auth/       # Authentication components
│   │   ├── common/     # Common components (Header, Footer)
│   │   ├── products/   # Product-related components
│   │   ├── cart/       # Cart components
│   │   ├── orders/     # Order components
│   │   ├── payments/   # Payment components
│   │   └── reviews/    # Review components
│   ├── pages/          # Main page components
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   └── App.js          # Main application component
└── package.json        # Node dependencies
```

## Database Schema

### Core Tables
- **User**: User accounts and authentication
- **Admin**: Admin user profiles
- **Customer**: Customer user profiles
- **Category**: Product categories (hierarchical)
- **Product**: Product information
- **Cart**: Shopping carts
- **Cart_Item**: Items in shopping carts
- **Order**: Customer orders
- **Order_Item**: Items in orders
- **Payment**: Payment records
- **Review**: Product reviews and ratings

### Key Relationships
- Users can be either Admin or Customer (one-to-one)
- Products belong to Categories (many-to-one)
- Customers have Carts (one-to-one)
- Carts contain Cart_Items (one-to-many)
- Orders contain Order_Items (one-to-many)
- Products can have multiple Reviews (one-to-many)

## Security Features

- **Password Hashing**: SHA-256 password hashing
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured CORS for frontend-backend communication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Role-based Access**: Admin-only endpoints protected

## API Design

### RESTful API
- RESTful endpoint design
- Consistent HTTP status codes
- JSON request/response format
- Proper error handling

### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Token included in subsequent requests
5. Server validates token for protected routes

## Development Features

### Backend
- Environment-based configuration
- Database connection pooling
- Error handling and logging
- API documentation
- Seed data for testing

### Frontend
- Responsive design
- Component-based architecture
- Error handling with user feedback
- Loading states
- Form validation

## Deployment Considerations

### Backend
- Environment variables for configuration
- Database connection management
- CORS configuration for production
- Error logging and monitoring

### Frontend
- Environment variables for API URLs
- Build optimization
- Static file serving
- Browser compatibility

## Testing

### Test Data
- Comprehensive seed data
- Sample users (admin and customers)
- Sample products and categories
- Sample orders and reviews

### Test Accounts
- **Admin**: admin@ecommerce.com / admin123
- **Customer**: john@example.com / password123

## Future Enhancements

### Potential Features
- Email notifications
- Advanced search and filtering
- Product recommendations
- Inventory management
- Analytics dashboard
- Mobile app
- Payment gateway integration
- Multi-language support
- Advanced reporting

### Technical Improvements
- Database optimization
- Caching implementation
- API rate limiting
- Automated testing
- CI/CD pipeline
- Docker containerization
- Microservices architecture

## Getting Started

1. Follow the setup guide in `docs/SETUP.md`
2. Review API documentation in `docs/API_ENDPOINTS.md`
3. Use the provided seed data for testing
4. Explore the codebase structure
5. Start with user registration and login

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you have the necessary permissions for any commercial use.
