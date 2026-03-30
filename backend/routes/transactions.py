from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Transaction, Category, User
import uuid

transactions_bp = Blueprint("transactions", __name__)

# ── GET all transactions ──────────────────────────────────────────────────────
@transactions_bp.route("/api/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = uuid.UUID(get_jwt_identity())
    transactions = Transaction.query.filter_by(
        user_id=user_id
    ).order_by(Transaction.txn_date.desc()).all()

    result = []
    for t in transactions:
        category = Category.query.get(t.category_id)
        result.append({
            "id":          str(t.id),
            "description": t.description,
            "amount":      float(t.amount),
            "type":        t.type,
            "txn_date":    str(t.txn_date),
            "category":    category.name if category else "Uncategorized",
            "category_id": str(t.category_id),
        })
    return jsonify(result)

# ── POST create transaction ───────────────────────────────────────────────────
@transactions_bp.route("/api/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    user_id       = uuid.UUID(get_jwt_identity())
    data          = request.get_json()
    description   = data.get("description")
    amount        = data.get("amount")
    type_         = data.get("type")
    category_name = data.get("category")
    txn_date      = data.get("txn_date")

    if not all([description, amount, type_, category_name, txn_date]):
        return jsonify({"error": "All fields are required"}), 400

    category = Category.query.filter_by(
        user_id=user_id,
        name=category_name
    ).first()

    if not category:
        category = Category(
            user_id=user_id,
            name=category_name,
            is_income=type_ == "income",
            is_active=True
        )
        db.session.add(category)
        db.session.flush()

    new_txn = Transaction(
        user_id=user_id,
        category_id=category.id,
        type=type_,
        amount=float(amount),
        txn_date=txn_date,
        description=description
    )
    db.session.add(new_txn)
    db.session.commit()

    return jsonify({
        "message": "Transaction created",
        "id":      str(new_txn.id)
    }), 201

# ── DELETE transaction ────────────────────────────────────────────────────────
@transactions_bp.route("/api/transactions/<id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(id):
    user_id     = uuid.UUID(get_jwt_identity())
    transaction = Transaction.query.filter_by(
        id=uuid.UUID(id),
        user_id=user_id
    ).first()

    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted"}), 200