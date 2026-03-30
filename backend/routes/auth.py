from flask import Blueprint, request, jsonify
from extensions import db, bcrypt, login_manager
from models import User
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import uuid

auth = Blueprint("auth", __name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(uuid.UUID(user_id))

# Register
@auth.route("/api/register", methods=["POST"])
def register():
    data         = request.get_json()
    email        = data.get("email")
    password     = data.get("password")
    display_name = data.get("display_name")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(
        email=email,
        password_hash=hashed_password,
        display_name=display_name
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# Login — returns JWT token
@auth.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message":      "Logged in successfully",
        "access_token": access_token,
        "user": {
            "id":           str(user.id),
            "email":        user.email,
            "display_name": user.display_name
        }
    }), 200

# Logout
@auth.route("/api/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

# Whoami
@auth.route("/api/whoami", methods=["GET"])
@jwt_required()
def whoami():
    user_id = get_jwt_identity()
    user    = User.query.get(uuid.UUID(user_id))
    return jsonify({
        "id":           str(user.id),
        "email":        user.email,
        "display_name": user.display_name
    })