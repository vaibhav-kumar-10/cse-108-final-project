from flask import Flask
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trades.db'
    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    db.init_app(app)
    return app

class User(db.Model, UserMixin):
     __tablename__ = 'users'
     id = db.Column(db.Integer, primary_key=True)
     username = db.Column(db.String(100), unique=True, nullable=False)
     email = db.Column(db.String(320), unique=True, nullable=False)
     password = db.Column(db.String(200), nullable=False)
    #  Will add more columns later
         
     def set_password(self, password):
        self.password = password

     def check_password(self, password):
        return self.password == password 
