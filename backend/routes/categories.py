from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("categories", __name__, url_prefix="/categories")

# Get all categories
@bp.route("/", methods=["GET"])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM Category")
    categories = cursor.fetchall()
    conn.close()
    return jsonify(categories)

# Add a new category
@bp.route("/", methods=["POST"])
def add_category():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Category (name, description, parent_category_id) VALUES (%s,%s,%s)",
                   (data["name"], data.get("description"), data.get("parent_category_id"))) # type: ignore
    conn.commit()
    conn.close()
    return jsonify({"message": "Category added"})
