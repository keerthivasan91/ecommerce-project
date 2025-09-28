from flask import Blueprint, request, jsonify
from db import get_db

categories_bp = Blueprint('categories', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

@categories_bp.route('/', methods=['GET'])
def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM categories")
        data = dict_from_cursor(cursor)
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()

@categories_bp.route('', methods=['POST'])
def add_category():
    data = request.get_json()
    name = data.get("name")
    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")
    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT is_admin FROM customers WHERE email=%s AND password=%s", (admin_email, admin_password))
        row = cursor.fetchone()
        if not row or row[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        cursor.execute("INSERT INTO categories (name) VALUES (%s)", (name,))
        conn.commit()
        return jsonify({"success": True, "message": "Category added"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@categories_bp.route('/<int:category_id>', methods=['PUT', 'DELETE'])
def modify_category(category_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        data = request.get_json() if request.method == "PUT" else request.args
        admin_email = data.get("admin_email")
        admin_password = data.get("admin_password")

        if not (admin_email and admin_password):
            return jsonify({"success": False, "message": "Admin credentials required"}), 401

        cursor.execute(
            "SELECT is_admin FROM customers WHERE email=%s AND password=%s",
            (admin_email, admin_password)
        )
        row = cursor.fetchone()
        if not row or row[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        if request.method == "PUT":
            name = data.get("name")
            if not name:
                return jsonify({"success": False, "message": "Category name required"}), 400
            cursor.execute("UPDATE categories SET name=%s WHERE category_id=%s", (name, category_id))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "message": "Category not found"}), 404
            conn.commit()
            return jsonify({"success": True, "message": "Category updated"})

        else:  # DELETE
            cursor.execute("DELETE FROM categories WHERE category_id=%s", (category_id,))
            if cursor.rowcount == 0:
                return jsonify({"success": False, "message": "Category not found"}), 404
            conn.commit()
            return jsonify({"success": True, "message": "Category deleted"})

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
