# from flask import Flask, request, redirect, url_for, jsonify, session
# from flask_login import LoginManager, current_user, login_user, logout_user, login_required
# from database import User, create_app, db
# from sqlalchemy import or_
# from datetime import timedelta

# app = create_app()

# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Set to 7 days, for example
# app.config['SESSION_COOKIE_NAME'] = 'my_session'
# app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
# app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
# app.config['SESSION_COOKIE_PATH'] = '/'  # Default path
# app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'

# # Flask login
# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = 'login'

# @login_manager.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))

# # Routes
# @app.route('/login', methods=['POST'])
# def login():
#     if current_user.is_authenticated:
#         return jsonify({"message": "Already logged in"}), 200
#     user = User.query.filter(
#         or_(
#             User.username == request.json['id'],
#             User.email == request.json['id']
#         )
#     ).first()
#     if user is None or not user.check_password(request.json['password']):
#         print('Couldnt log in user!')
#         return jsonify({"error": "Invalid username or password"}), 401
#     login_user(user)
#     session.permanent = True  # Make the session cookie persistent
#     return jsonify({"message": "Login successful"}), 200

# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json
#     # Validate required fields
#     if not all(key in data for key in ['username', 'email', 'password']):
#         return jsonify({"error": "Missing username, email, or password"}), 400
#     username = data['username']
#     email = data['email']
#     password = data['password']
#     # Ensure username and email are unique
#     existing_user = User.query.filter(
#         or_(
#             User.username == username,
#             User.email == email
#         )
#     ).first()
#     if existing_user:
#         return jsonify({"error": "Username or email already exists"}), 409
#     # Create user for db
#     new_user = User(username=username, email=email)
#     new_user.set_password(password)  # Hash the password
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({"message": "Registration successful"}), 201

# @app.route('/logout', methods=['POST'])
# def logout():
#     # Ensure the user is authenticated before logging out
#     if current_user.is_authenticated:
#         logout_user()  # Logs the user out and clears their session
#         return jsonify({"message": "Logout successful"}), 200
#     else:
#         return jsonify({"error": "No user is logged in"}), 400

# @app.route('/auth/status', methods=['GET'])
# @login_required
# def auth_status():
#     return jsonify({"logged_in": True, "user": current_user.username}), 200

# @login_manager.unauthorized_handler
# def unauthorized_callback():
#     return jsonify({"error": "User not authenticated"}), 401
    

from flask import Flask
from flask_cors import CORS

from extensions import db, migrate, jwt
from auth.views import auth_blueprint
from stocks.views import stock_blueprint

app = Flask(__name__)
app.register_blueprint(blueprint=auth_blueprint) 
app.register_blueprint(blueprint=stock_blueprint) 
app.config.from_object("config")

db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)
CORS(app, supports_credentials=True)
# cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Create database tables
with app.app_context():
    db.create_all()
    
# @app.after_request
# def log_cookies(response):
#     print(response.headers.get('Set-Cookie'))
#     return response

if __name__ == '__main__':
    app.run(debug=True, port=7000)