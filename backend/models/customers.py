from flask import Blueprint, request, jsonify
from db import get_db

customers_bp = Blueprint('customers', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

@customers_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not (name and email and password):
        return jsonify({"success": False, "message": "Name, email and password required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT customer_id FROM customers WHERE email=%s", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email already registered"}), 400

        cursor.execute(
            "INSERT INTO customers (name,email,password) VALUES (%s,%s,%s)",
            (name, email, password)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Signup successful"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@customers_bp.route('/login', methods=['POST'])
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
            return jsonify({"success": True, "customer_id": customer_id, "name": name, "is_admin": bool(is_admin)})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    finally:
        cursor.close()
        conn.close()

@customers_bp.route('/', methods=['GET'])
def get_customers():
    admin_email = request.args.get('admin_email')
    admin_password = request.args.get('admin_password')
    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT is_admin FROM customers WHERE email=%s AND password=%s", (admin_email, admin_password))
        r = cursor.fetchone()
        if not r or r[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        cursor.execute("SELECT customer_id, name, email, is_admin FROM customers")
        data = dict_from_cursor(cursor)
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()

@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_category(customer_id):
    admin_email = request.args.get("admin_email")
    admin_password = request.args.get("admin_password")
    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT is_admin FROM customers WHERE email=%s AND password=%s",
            (admin_email, admin_password)
        )
        row = cursor.fetchone()
        if not row or row[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        cursor.execute("DELETE FROM customers WHERE customer_id=%s", (customer_id,))
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "customer not found"}), 404

        conn.commit()
        return jsonify({"success": True, "message": "customer deleted"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@customers_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    data = request.get_json()
    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")
    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin')

    if not any([name, email, password, is_admin is not None]):
        return jsonify({"success": False, "message": "At least one field required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT is_admin FROM customers WHERE email=%s AND password=%s",
            (admin_email, admin_password)
        )
        row = cursor.fetchone()
        if not row or row[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        # Check if customer exists
        cursor.execute("SELECT customer_id FROM customers WHERE customer_id=%s", (customer_id,))
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "Customer not found"}), 404

        # Build update query dynamically
        updates = []
        values = []
        if name:
            updates.append("name=%s")
            values.append(name)
        if email:
            updates.append("email=%s")
            values.append(email)
        if password:
            updates.append("password=%s")
            values.append(password)
        if is_admin is not None:
            updates.append("is_admin=%s")
            values.append(is_admin)

        values.append(customer_id)
        query = f"UPDATE customers SET {', '.join(updates)} WHERE customer_id=%s"
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"success": True, "message": "Customer updated"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
