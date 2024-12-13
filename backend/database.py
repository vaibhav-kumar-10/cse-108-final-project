from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask('app')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tradeinfo.db'

db = SQLAlchemy(app)

class User(db.Model):
     __tablename__ = 'users'
     id = db.Column(db.Integer, primary_key=True)
     username = db.Column(db.String(100), unique=True, nullable=False)
     password = db.Column(db.String(200), nullable=False)
     # Will add more columns later
     
with app.app_context():
    db.create_all() 
