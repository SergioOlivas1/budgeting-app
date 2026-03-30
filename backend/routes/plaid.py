from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models import Transaction, Category
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
import os
import datetime

plaid_bp = Blueprint("plaid", __name__)

# ── Plaid client setup ──────────────────────────────────────────────────────
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": os.getenv("PLAID_CLIENT_ID"),
        "secret":   os.getenv("PLAID_SECRET"),
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# ── Step 1: Create a link token ─────────────────────────────────────────────
@plaid_bp.route("/api/plaid/create-link-token", methods=["POST"])
@login_required
def create_link_token():
    try:
        request_data = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(client_user_id=str(current_user.id)),
            client_name="BudgetWise",
            products=[Products("transactions")],
            country_codes=[CountryCode("US")],
            language="en"
        )
        response = client.link_token_create(request_data)
        return jsonify({ "link_token": response["link_token"] })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

# ── Step 2: Exchange public token for access token ──────────────────────────
@plaid_bp.route("/api/plaid/exchange-token", methods=["POST"])
@login_required
def exchange_token():
    try:
        public_token = request.get_json().get("public_token")
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        response = client.item_public_token_exchange(exchange_request)
        access_token = response["access_token"]

        # Store access token on the user (we'll add this column next)
        current_user.plaid_access_token = access_token
        db.session.commit()

        return jsonify({ "message": "Bank connected successfully" })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

# ── Step 3: Fetch and save transactions ─────────────────────────────────────
@plaid_bp.route("/api/plaid/sync-transactions", methods=["POST"])
@login_required
def sync_transactions():
    try:
        if not current_user.plaid_access_token:
            return jsonify({ "error": "No bank connected" }), 400

        # Fetch last 30 days of transactions
        end_date   = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=30)

        txn_request = TransactionsGetRequest(
            access_token=current_user.plaid_access_token,
            start_date=start_date,
            end_date=end_date
        )
        response = client.transactions_get(txn_request)
        transactions = response["transactions"]

        added = 0
        for txn in transactions:
            # Find or create a category
            cat_name = txn["category"][0] if txn["category"] else "Uncategorized"
            category = Category.query.filter_by(
                user_id=current_user.id,
                name=cat_name
            ).first()

            if not category:
                category = Category(
                    user_id=current_user.id,
                    name=cat_name,
                    is_income=txn["amount"] < 0,
                    is_active=True
                )
                db.session.add(category)
                db.session.flush()

            # Skip if transaction already exists
            existing = Transaction.query.filter_by(
                user_id=current_user.id,
                description=txn["name"],
                txn_date=txn["date"],
                amount=abs(txn["amount"])
            ).first()

            if not existing:
                new_txn = Transaction(
                    user_id=current_user.id,
                    category_id=category.id,
                    type="income" if txn["amount"] < 0 else "expense",
                    amount=abs(txn["amount"]),
                    txn_date=txn["date"],
                    description=txn["name"]
                )
                db.session.add(new_txn)
                added += 1

        db.session.commit()
        return jsonify({ "message": f"Synced {added} new transactions" })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

# ── Get all transactions ─────────────────────────────────────────────────────
@plaid_bp.route("/api/transactions", methods=["GET"])
@login_required
def get_transactions():
    transactions = Transaction.query.filter_by(
        user_id=current_user.id
    ).order_by(Transaction.txn_date.desc()).all()

    return jsonify([{
        "id":          str(t.id),
        "description": t.description,
        "amount":      float(t.amount),
        "type":        t.type,
        "txn_date":    str(t.txn_date),
        "category_id": str(t.category_id),
    } for t in transactions])