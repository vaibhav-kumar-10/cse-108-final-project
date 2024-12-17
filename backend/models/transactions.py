from datetime import datetime
from extensions import db

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_transaction_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type =db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref ="transactions")