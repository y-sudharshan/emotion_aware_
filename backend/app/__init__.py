from flask import Flask
from flask_cors import CORS
from backend.app.routes import routes

def create_app():
    """
    Initializes the Flask application.
    """
    app = Flask(__name__)
    CORS(app)  # Allow frontend requests

    # Register API routes
    app.register_blueprint(routes)
   
    return app
