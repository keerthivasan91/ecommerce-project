from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import routes
from routes import users, products, categories, cart, orders, payments, reviews

# Register routes
app.register_blueprint(users.bp)
app.register_blueprint(products.bp)
app.register_blueprint(categories.bp)
app.register_blueprint(cart.bp)
app.register_blueprint(orders.bp)
app.register_blueprint(payments.bp)
app.register_blueprint(reviews.bp)

@app.route("/")
def home():
    return {"message": "E-commerce API is running!"}
