from flask import Flask
from flask_cors import CORS # type: ignore

# Auth routes inside models/
from models.signup import signup_bp
from models.login import login_bp

# Other CRUD routes
from models import (
    customers_bp, products_bp, cart_bp, orders_bp,
    payments_bp, reviews_bp, categories_bp
)

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp,url_prefix="/auth")
app.register_blueprint(customers_bp, url_prefix='/customers')
app.register_blueprint(products_bp, url_prefix='/products')
app.register_blueprint(cart_bp, url_prefix='/cart')
app.register_blueprint(orders_bp, url_prefix='/orders')
app.register_blueprint(payments_bp, url_prefix='/payments')
app.register_blueprint(reviews_bp, url_prefix='/reviews')
app.register_blueprint(categories_bp, url_prefix='/categories')

if __name__ == '__main__':
    app.run(debug=True)
