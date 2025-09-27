# E-commerce Project Setup Guide

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## Database Setup

1. **Install MySQL**
   - Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/)
   - Start MySQL service

2. **Create Database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   source database/schema.sql
   source database/seed_data.sql
   ```

3. **Verify Database**
   ```sql
   USE ecommerce_db;
   SHOW TABLES;
   ```

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your database credentials.

6. **Run the backend server**
   ```bash
   python run.py
   ```
   The API will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Testing the Setup

1. **Backend API Test**
   ```bash
   curl http://localhost:5000/
   ```
   Should return: `{"message": "E-commerce API is running!", "version": "1.0.0"}`

2. **Frontend Test**
   - Open `http://localhost:3000` in your browser
   - You should see the E-commerce homepage

## Default Login Credentials

The seed data includes the following test accounts:

### Admin Account
- **Email**: admin@ecommerce.com
- **Password**: admin123

### Customer Accounts
- **Email**: john@example.com
- **Password**: password123
- **Email**: jane@example.com
- **Password**: password123

## Project Structure

```
ecommerce-project/
├── backend/                 # Flask API
│   ├── app.py              # Main Flask application
│   ├── config.py           # Database configuration
│   ├── models.py           # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json       # Node dependencies
├── database/              # Database files
│   ├── schema.sql         # Database schema
│   └── seed_data.sql      # Sample data
└── docs/                  # Documentation
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database `ecommerce_db` exists

2. **Port Already in Use**
   - Backend: Change `PORT` in `.env` file
   - Frontend: Use `npm start -- --port 3001`

3. **Module Not Found Error**
   - Backend: Ensure virtual environment is activated
   - Frontend: Run `npm install` again

4. **CORS Error**
   - Check backend CORS configuration
   - Verify frontend proxy settings

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check that all services are running

## Next Steps

After successful setup:
1. Explore the API endpoints using the documentation
2. Test user registration and login
3. Add products and categories
4. Test the shopping cart functionality
5. Process test orders and payments
