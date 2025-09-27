from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("orders", __name__, url_prefix="/orders")

@bp.route("/", methods=["GET"])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM `Order`")
    orders = cursor.fetchall()
    conn.close()
    return jsonify(orders)
