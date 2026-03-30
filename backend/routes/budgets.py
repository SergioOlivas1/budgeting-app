from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import BudgetLimit, MonthlyBudget, Category, Transaction
import uuid
import datetime

budgets_bp = Blueprint("budgets", __name__)

def get_or_create_monthly_budget(user_id):
    today       = datetime.date.today()
    month_start = today.replace(day=1)

    budget = MonthlyBudget.query.filter_by(
        user_id=user_id,
        month_start=month_start
    ).first()

    if not budget:
        budget = MonthlyBudget(
            user_id=user_id,
            month_start=month_start
        )
        db.session.add(budget)
        db.session.flush()

    return budget

# ── GET all budgets ───────────────────────────────────────────────────────────
@budgets_bp.route("/api/budgets", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id        = uuid.UUID(get_jwt_identity())
    monthly_budget = get_or_create_monthly_budget(user_id)
    db.session.commit()

    limits = BudgetLimit.query.filter_by(
        monthly_budget_id=monthly_budget.id
    ).all()

    today       = datetime.date.today()
    month_start = today.replace(day=1)

    result = []
    for limit in limits:
        category = Category.query.get(limit.category_id)
        spent = db.session.query(
            db.func.sum(Transaction.amount)
        ).filter(
            Transaction.user_id    == user_id,
            Transaction.category_id == limit.category_id,
            Transaction.type       == "expense",
            Transaction.txn_date   >= month_start
        ).scalar() or 0

        result.append({
            "id":       str(limit.id),
            "category": category.name if category else "Unknown",
            "limit":    float(limit.limit_amount),
            "spent":    float(spent),
        })

    return jsonify(result)

# ── POST create budget ────────────────────────────────────────────────────────
@budgets_bp.route("/api/budgets", methods=["POST"])
@jwt_required()
def create_budget():
    user_id       = uuid.UUID(get_jwt_identity())
    data          = request.get_json()
    category_name = data.get("category")
    limit_amount  = data.get("limit")

    if not category_name or not limit_amount:
        return jsonify({"error": "Category and limit are required"}), 400

    category = Category.query.filter_by(
        user_id=user_id,
        name=category_name
    ).first()

    if not category:
        category = Category(
            user_id=user_id,
            name=category_name,
            is_income=False,
            is_active=True
        )
        db.session.add(category)
        db.session.flush()

    monthly_budget = get_or_create_monthly_budget(user_id)

    existing = BudgetLimit.query.filter_by(
        monthly_budget_id=monthly_budget.id,
        category_id=category.id
    ).first()

    if existing:
        return jsonify({"error": "Budget already exists for this category"}), 400

    new_limit = BudgetLimit(
        monthly_budget_id=monthly_budget.id,
        category_id=category.id,
        limit_amount=float(limit_amount)
    )
    db.session.add(new_limit)
    db.session.commit()

    return jsonify({"message": "Budget created", "id": str(new_limit.id)}), 201

# ── PUT update budget ─────────────────────────────────────────────────────────
@budgets_bp.route("/api/budgets/<id>", methods=["PUT"])
@jwt_required()
def update_budget(id):
    limit = BudgetLimit.query.get(uuid.UUID(id))

    if not limit:
        return jsonify({"error": "Budget not found"}), 404

    data               = request.get_json()
    limit.limit_amount = float(data.get("limit", limit.limit_amount))
    db.session.commit()

    return jsonify({"message": "Budget updated"}), 200

# ── DELETE budget ─────────────────────────────────────────────────────────────
@budgets_bp.route("/api/budgets/<id>", methods=["DELETE"])
@jwt_required()
def delete_budget(id):
    limit = BudgetLimit.query.get(uuid.UUID(id))

    if not limit:
        return jsonify({"error": "Budget not found"}), 404

    db.session.delete(limit)
    db.session.commit()

    return jsonify({"message": "Budget deleted"}), 200