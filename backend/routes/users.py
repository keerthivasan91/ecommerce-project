from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

bp = Blueprint("users", __name__, url_prefix="/users")

@bp.route("/", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # type: ignore
    cursor.execute("SELECT * FROM User")
    users = cursor.fetchall()
    conn.close()
    return jsonify(users)

@bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO User (username, email, password) VALUES (%s, %s, %s)",
                   (data["username"], data["email"], data["password"])) # type: ignore
    conn.commit()
    conn.close()
    return jsonify({"message": "User created"})
