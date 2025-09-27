from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("payments", __name__, url_prefix="/payments")

@bp.route("/", methods=["GET"])
def get_payments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM Payment")
    payments = cursor.fetchall()
    conn.close()
    return jsonify(payments)
