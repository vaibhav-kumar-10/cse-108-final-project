from flask import Flask
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trades.db'
    app.config['SECRET_KEY'] = 'your-secret-key'
    db.init_app(app)
    return app
