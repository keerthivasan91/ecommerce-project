from flask import Blueprint, request, jsonify
from db import get_db
from collections import defaultdict  # <-- must import this

orders_bp = Blueprint('orders', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

@orders_bp.route('', methods=['POST'])
def create_order_from_cart():
    data = request.get_json()
    customer_id = data.get('customer_id')
    if not customer_id:
        return jsonify({"success": False, "message": "customer_id required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO orders (customer_id) VALUES (%s)", (customer_id,))
        order_id = cursor.lastrowid

        cursor.execute("SELECT product_id, quantity FROM cart WHERE customer_id=%s", (customer_id,))
        items = cursor.fetchall()
        if not items:
            conn.rollback()
            return jsonify({"success": False, "message": "Cart is empty"}), 400

        for prod_id, qty in items:
            cursor.execute("SELECT price, stock FROM products WHERE product_id=%s", (prod_id,))
            p = cursor.fetchone()
            if not p:
                conn.rollback()
                return jsonify({"success": False, "message": f"Product {prod_id} not found"}), 400
            price, stock = p
            if stock < qty:
                conn.rollback()
                return jsonify({"success": False, "message": f"Not enough stock for product {prod_id}"}), 400

            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s,%s,%s,%s)",
                (order_id, prod_id, qty, price)
            )
            cursor.execute("UPDATE products SET stock = stock - %s WHERE product_id=%s", (qty, prod_id))

        cursor.execute("DELETE FROM cart WHERE customer_id=%s", (customer_id,))
        conn.commit()
        return jsonify({"success": True, "order_id": order_id, "message": "Order placed"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@orders_bp.route("", methods=["GET"])
def get_all_orders():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
    SELECT o.order_id, o.customer_id, o.order_date, oi.order_item_id,
           oi.product_id, p.name, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
""")
        rows = cursor.fetchall()
        orders_dict = defaultdict(lambda: {"items": []})
        for r in rows: # type: ignore
            order_id = r[0]
            if "order_id" not in orders_dict[order_id]:
                orders_dict[order_id].update({
                    "order_id": r[0],
                    "customer_id": r[1],
                    "date_created": r[2],
                    "items": []
                })
            orders_dict[order_id]["items"].append({
    "order_item_id": r[3],
    "product_id": r[4],
    "name": r[5],
    "quantity": r[6],
    "price": float(r[7])  # this is oi.price
})

        return jsonify(list(orders_dict.values()))
    finally:
        cursor.close()
        conn.close()  # removed the extra /

@orders_bp.route("/user/<int:customer_id>", methods=["GET"])
def get_user_orders(customer_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT o.order_id, o.customer_id, o.order_date, oi.order_item_id,
                   oi.product_id, p.name, oi.quantity, oi.price
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE o.customer_id=%s
        """, (customer_id,))
        rows = cursor.fetchall()
        orders_dict = defaultdict(lambda: {"items": []})
        for r in rows: # type: ignore
            order_id = r[0]
            if "order_id" not in orders_dict[order_id]:
                orders_dict[order_id].update({
                    "order_id": r[0],
                    "customer_id": r[1],
                    "date_created": r[2],
                    "items": []
                })
            orders_dict[order_id]["items"].append({
                "order_item_id": r[3],
                "product_id": r[4],
                "name": r[5],
                "quantity": r[6],
                "price": float(r[7])
            })
        return jsonify(list(orders_dict.values()))
    finally:
        cursor.close()
        conn.close()
