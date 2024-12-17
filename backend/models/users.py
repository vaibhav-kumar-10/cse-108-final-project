from sqlalchemy.ext.hybrid import hybrid_property

from extensions import db, pwd_context

class User(db.Model):
     __tablename__ = 'users'
     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
     name = db.Column(db.String(100), unique=True, nullable=False)
     email = db.Column(db.String(320), unique=True, nullable=False)
     age = db.Column(db.Integer)
     _password = db.Column("password", db.String(255), nullable=False)
     money = db.Column(db.Float, default=10000, nullable=False)
    #  Will add more columns later
    
         
     @hybrid_property
     def password(self):
         return self._password

     @password.setter
     def password(self, value):
         self._password = pwd_context.hash(value)