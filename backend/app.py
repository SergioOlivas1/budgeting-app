from flask import Flask
from extensions import db, migrate, login_manager, bcrypt, cors, jwt
from config import Config
from routes.auth import auth
from routes.transactions import transactions_bp
from routes.budgets import budgets_bp
from routes.user import user_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app,
        resources={r"/api/*": {"origins": [
            "http://localhost:5173",
            "https://budgeting-app-gilt.vercel.app",  
        ]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    app.register_blueprint(auth)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(budgets_bp)
    app.register_blueprint(user_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)