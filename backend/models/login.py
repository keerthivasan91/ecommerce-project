from flask import Blueprint, request, jsonify
from db import get_db

login_bp = Blueprint("login", __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not (email and password):
        return jsonify({"success": False, "message": "Email and password required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT customer_id, name, is_admin FROM customers WHERE email=%s AND password=%s",
            (email, password)
        )
        row = cursor.fetchone()
        if row:
            customer_id, name, is_admin = row
            return jsonify({
                "success": True,
                "customer_id": customer_id,
                "name": name,
                "is_admin": bool(is_admin)
            })
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    finally:
        cursor.close()
        conn.close()
