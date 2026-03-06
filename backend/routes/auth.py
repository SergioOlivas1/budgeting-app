from flask import Blueprint, request, jsonify
from extensions import db, bcrypt, login_manager
from models import User
from flask_login import login_user, logout_user, login_required
import uuid

auth = Blueprint("auth", __name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(uuid.UUID(user_id))

# Register
@auth.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    display_name = data.get("display_name")

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create new user
    new_user = User(
        email=email,
        password_hash=hashed_password,
        display_name=display_name
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# Login
@auth.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Find user
    user = User.query.filter_by(email=email).first()

    # Check password
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({
        "message": "Logged in successfully",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "display_name": user.display_name
        }
    }), 200

# Logout
@auth.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200