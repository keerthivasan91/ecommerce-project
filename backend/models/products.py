from flask import Blueprint, request, jsonify
from db import get_db

products_bp = Blueprint('products', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

def dict_from_cursor_row(cursor, row):
    cols = [c[0] for c in cursor.description]
    return dict(zip(cols, row))

@products_bp.route('/', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    conn = get_db()
    cursor = conn.cursor()
    try:
        if category_id:
            cursor.execute(
                "SELECT p.*, c.name as category FROM products p "
                "LEFT JOIN categories c ON p.category_id=c.category_id WHERE p.category_id=%s",
                (category_id,)
            )
        else:
            cursor.execute(
                "SELECT p.*, c.name as category FROM products p "
                "LEFT JOIN categories c ON p.category_id=c.category_id"
            )
        data = dict_from_cursor(cursor)
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()

@products_bp.route('/<path:product_name>', methods=['GET'])
def get_product(product_name):
    conn = get_db()
    cursor = conn.cursor()
    product_name = product_name.strip()
    try:
        cursor.execute(
            "SELECT p.*, c.name as category FROM products p "
            "LEFT JOIN categories c ON p.category_id=c.category_id "
            "WHERE LOWER(p.name) LIKE LOWER(%s)",
            (f"%{product_name}%",)  # Wrap in % for partial match
        )

        product = cursor.fetchone()
        
        if product:
            data = dict_from_cursor_row(cursor, product)
            return jsonify(data)
        else:
            return jsonify({'error': 'Product not found'}), 404
    finally:
        
        cursor.close()
        conn.close()

@products_bp.route('', methods=['POST'])
def add_product():
    data = request.get_json()
    product_id = data.get('product_id')
    name = data.get('name')
    price = data.get('price', 0)
    stock = data.get('stock', 0)
    category_id = data.get('category_id')
    description = data.get('description', '')
    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")

    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT is_admin FROM customers WHERE email=%s AND password=%s", (admin_email, admin_password))
        r = cursor.fetchone()
        if not r or r[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403 

        cursor.execute(
            "INSERT INTO products (product_id, category_id, name, price, stock, description) VALUES (%s,%s,%s,%s,%s,%s)",
            (product_id, category_id, name, price, stock, description)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Product added"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@products_bp.route('/<string:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    product_id = data.get('product_id')
    name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')
    category_id = data.get('category_id')
    admin_email = data.get("admin_email")
    admin_password = data.get("admin_password")

    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT is_admin FROM customers WHERE email=%s AND password=%s", (admin_email, admin_password))
        r = cursor.fetchone()
        if not r or r[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        cursor.execute(
            "UPDATE products SET product_id=%s, price=%s, stock=%s, category_id=%s WHERE product_id=%s",
            (product_id, price, stock, category_id, product_id)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Product updated"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@products_bp.route('/<string:product_id>', methods=['DELETE'])
def delete_product(product_id):
    admin_email = request.args.get("admin_email")
    admin_password = request.args.get("admin_password")

    if not (admin_email and admin_password):
        return jsonify({"success": False, "message": "Admin credentials required"}), 401

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT is_admin FROM customers WHERE email=%s AND password=%s", (admin_email, admin_password))
        r = cursor.fetchone()
        if not r or r[0] != 1:
            return jsonify({"success": False, "message": "Not authorized"}), 403

        cursor.execute("DELETE FROM products WHERE product_id=%s", (product_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Product deleted"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
