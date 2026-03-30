from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User
import uuid

user_bp = Blueprint("user", __name__)

# ── GET current user ──────────────────────────────────────────────────────────
@user_bp.route("/api/user", methods=["GET"])
@jwt_required()
def get_user():
    user_id = uuid.UUID(get_jwt_identity())
    user    = User.query.get(user_id)
    return jsonify({
        "id":           str(user.id),
        "email":        user.email,
        "display_name": user.display_name,
    })

# ── PUT update profile ────────────────────────────────────────────────────────
@user_bp.route("/api/user", methods=["PUT"])
@jwt_required()
def update_user():
    user_id      = uuid.UUID(get_jwt_identity())
    user         = User.query.get(user_id)
    data         = request.get_json()
    display_name = data.get("display_name")
    email        = data.get("email")

    if display_name:
        user.display_name = display_name
    if email:
        user.email = email

    db.session.commit()
    return jsonify({"message": "Profile updated"}), 200

# ── PUT change password ───────────────────────────────────────────────────────
@user_bp.route("/api/user/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id    = uuid.UUID(get_jwt_identity())
    user       = User.query.get(user_id)
    data       = request.get_json()
    current_pw = data.get("current_password")
    new_pw     = data.get("new_password")

    if not bcrypt.check_password_hash(user.password_hash, current_pw):
        return jsonify({"error": "Current password is incorrect"}), 401

    user.password_hash = bcrypt.generate_password_hash(new_pw).decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Password updated"}), 200

# ── DELETE account ────────────────────────────────────────────────────────────
@user_bp.route("/api/user", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = uuid.UUID(get_jwt_identity())
    user    = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Account deleted"}), 200