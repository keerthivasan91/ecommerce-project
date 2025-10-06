from flask import Blueprint, request, jsonify
from db import get_db

reviews_bp = Blueprint('reviews', __name__)

def dict_from_cursor(cursor):
    cols = [c[0] for c in cursor.description]
    rows = cursor.fetchall()
    return [dict(zip(cols, r)) for r in rows]

@reviews_bp.route('', methods=['POST'])
def add_review():
    data = request.get_json()
    customer_id = data.get('customer_id')
    product_id = data.get('product_id')
    rating = int(data.get('rating', 0))
    comment = data.get('comment', '')

    if not (customer_id and product_id and rating):
        return jsonify({"success": False, "message": "customer_id, product_id, rating required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO reviews (customer_id, product_id, rating, comment) VALUES (%s,%s,%s,%s)",
                       (customer_id, product_id, rating, comment))
        conn.commit()
        return jsonify({"success": True, "message": "Review added"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@reviews_bp.route('/<string:product_id>', methods=['GET'])
def get_reviews(product_id):
    # Only fetch reviews, no credentials required
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
    "SELECT r.*, c.name FROM reviews r "
    "LEFT JOIN customers c ON r.customer_id=c.customer_id "
    "WHERE r.product_id=%s",
    (product_id,)
)

        data = dict_from_cursor(cursor)
        return jsonify(data)  # Returns list of reviews directly
    finally:
        cursor.close()
        conn.close()
