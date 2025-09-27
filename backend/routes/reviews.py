from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("reviews", __name__, url_prefix="/reviews")

@bp.route("/", methods=["GET"])
def get_reviews():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM Review")
    reviews = cursor.fetchall()
    conn.close()
    return jsonify(reviews)
