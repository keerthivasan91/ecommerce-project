from flask import Blueprint, request, jsonify
from db import get_db

cart_bp = Blueprint('cart', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

@cart_bp.route('/<int:customer_id>', methods=['GET'])
def get_cart(customer_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT c.cart_id, c.product_id, c.quantity, p.name, p.price "
            "FROM cart c JOIN products p ON c.product_id=p.product_id WHERE c.customer_id=%s",
            (customer_id,)
        )
        data = dict_from_cursor(cursor)
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()

@cart_bp.route('/', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    customer_id = data.get('customer_id')
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    if not (customer_id and product_id):
        return jsonify({"success": False, "message": "customer_id and product_id required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT quantity FROM cart WHERE customer_id=%s AND product_id=%s", (customer_id, product_id))
        r = cursor.fetchone()
        if r:
            new_q = r[0] + quantity
            cursor.execute("UPDATE cart SET quantity=%s WHERE customer_id=%s AND product_id=%s", (new_q, customer_id, product_id))
        else:
            cursor.execute("INSERT INTO cart (customer_id, product_id, quantity) VALUES (%s,%s,%s)", (customer_id, product_id, quantity))
        conn.commit()
        return jsonify({"success": True, "message": "Added to cart"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@cart_bp.route('/<int:cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cart WHERE cart_id=%s", (cart_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Removed from cart"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
