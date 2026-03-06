from flask import Flask
from extensions import db, migrate, login_manager, bcrypt, cors
from config import Config
from routes.auth import auth

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(auth)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)