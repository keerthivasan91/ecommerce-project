from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("products", __name__, url_prefix="/products")

@bp.route("/", methods=["GET"])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM Product")
    products = cursor.fetchall()
    conn.close()
    return jsonify(products)

@bp.route("/", methods=["POST"])
def add_product():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Product (name, description, price, quantity, category_id, admin_id) VALUES (%s,%s,%s,%s,%s,%s)",
                   (data["name"], data["description"], data["price"], data["quantity"], data["category_id"], data["admin_id"])) # type: ignore
    conn.commit()
    conn.close()
    return jsonify({"message": "Product added"})
