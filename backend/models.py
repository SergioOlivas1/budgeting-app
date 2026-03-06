from extensions import db
from flask_login import UserMixin
import uuid

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.Text, unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    display_name = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    categories = db.relationship("Category", backref="user", lazy=True)
    transactions = db.relationship("Transaction", backref="user", lazy=True)
    monthly_budgets = db.relationship("MonthlyBudget", backref="user", lazy=True)


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.Text, nullable=False)
    is_income = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())


class MonthlyBudget(db.Model):
    __tablename__ = "monthly_budgets"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    month_start = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())


class BudgetLimit(db.Model):
    __tablename__ = "budget_limits"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    monthly_budget_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("monthly_budgets.id"), nullable=False)
    category_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=False)
    limit_amount = db.Column(db.Numeric, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=False)
    type = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    txn_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())