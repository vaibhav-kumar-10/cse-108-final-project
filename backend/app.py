from flask import Flask, request, redirect, url_for, jsonify
from flask_login import LoginManager, current_user, login_user
from database import User, create_app, db

app = create_app()

# Flask login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# app.secret_key = 'keep it secret, keep it safe' # Add this to avoid an 
# app.config['SECRET_KEY'] = 'secret-key-goes-here'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in"}), 200
    user = User.query.filter_by(username=request.json['username']).first()
    if user is None or not user.check_password(request.json['password']):
        print('Couldnt log in user!')
        return jsonify({"error": "Invalid username or password"}), 401
    login_user(user)
    return jsonify({"message": "Login successful"}), 200

# Create database tables
with app.app_context():
    db.create_all()
    
if __name__ == '__main__':
    app.run(debug=True)