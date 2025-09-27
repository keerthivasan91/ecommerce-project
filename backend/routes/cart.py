from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("cart", __name__, url_prefix="/cart")

@bp.route("/", methods=["GET"])
def get_cart_items():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM Cart_Item")
    items = cursor.fetchall()
    conn.close()
    return jsonify(items)
