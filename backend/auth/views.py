from flask import current_app as app
from flask import Blueprint, request, jsonify
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta

from api.schemas.user import UserCreateSchema, UserSchema
from extensions import db, pwd_context, jwt
from models.users import User
from auth.helpers import add_token_to_database, revoke_token, is_token_revoked
from models.transactions import Transaction

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")

@auth_blueprint.route("/register", methods=["POST"])
def register():
    if not request.is_json:
        return {"msg", "Missing JSON in request"}, 400
    # Use schema for parsing json to a db object
    schema = UserCreateSchema()
    user = schema.load(request.json)
    # Add user to database
    db.session.add(user)
    db.session.commit()
    # Get json of db object with schema to return back
    schema = UserSchema()
    
    return {"msg": "Created user", "user": schema.dump(user)}

# session_lifetime = current_app.config['PERMANENT_SESSION_LIFETIME']   # Dynamically get from Flask app config
def set_jwt_cookie(response, token, cookie_name='access_token_cookie', max_age=None):
    response.set_cookie(
        cookie_name,
        token,
        max_age,
        secure=True,  # Use True for HTTPS
        httponly=True,  # Prevent JavaScript access
        samesite='None',  # Set to 'None' for cross-site requests
        path='/'
    )
    return response

@auth_blueprint.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 410

    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 420

    user = User.query.filter_by(email=email).first()
    if user is None or not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad credentials"}), 430
    # Generate tokens and add to database
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    add_token_to_database(access_token)
    add_token_to_database(refresh_token)
    # Add tokens to http header
    response = jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "name": user.name
    })
    # Adds cookies to response, current implementation will leave them unused
    set_jwt_cookie(response, access_token, cookie_name='access_token')
    set_jwt_cookie(response, refresh_token, cookie_name='refresh_token', max_age=timedelta(days=7))
    return response, 200

@auth_blueprint.route("/logout", methods=["POST"])
@jwt_required()
def logout(): # Logout the user by revoking the current access token.
    # Get the unique token identifier (jti) from the JWT
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    # Revoke the token by marking it as revoked in the database
    revoke_token(jti, user_identity)
    return jsonify({"message": "Successfully logged out"}), 200

@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    add_token_to_database(access_token)
    return jsonify({"access_token": access_token}), 200

@auth_blueprint.route("/revoke_access", methods=["DELETE"])
@jwt_required()
def revoke_access_token():
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    revoke_token(jti, user_identity)
    return jsonify({"message": "token revoked"}), 200


@auth_blueprint.route("/revoke_refresh", methods=["DELETE"])
@jwt_required(refresh=True)
def revoke_refresh_token():
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    revoke_token(jti, user_identity)
    return jsonify({"message": "token revoked"}), 200

@auth_blueprint.route("/test", methods=["GET"])
@jwt_required()
def test():
    return jsonify({"msg": "Test!"})

@jwt.user_lookup_loader
def user_loader_callback(jwt_headers, jwt_payload):
    identity = jwt_payload[app.config["JWT_IDENTITY_CLAIM"]]
    return User.query.get(identity)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_headers, jwt_payload):
    return is_token_revoked(jwt_payload)

@auth_blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    return jsonify(e.messages), 400


@auth_blueprint.route("/deposit", methods=["POST"])
@jwt_required()
def deposit():
    user_id = get_jwt_identity()
    data = request.get_json()
    amount = data.get("amount")

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid ddeposit amount"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    user.money += amount
    transaction = Transaction(user_id=user_id, amount=amount, type="deposit")
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"msg": "Deposit successful", "balance": user.money}), 200

@auth_blueprint.route("/withdraw", methods=["POST"])
@jwt_required()
def withdraw():
    user_id = get_jwt_identity()
    data = request.get_json()
    amount = data.get("amount")

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid withdrawal amount"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user.money < amount:
        return jsonify({"msg": "Insufficient balance"}), 400

    user.money -= amount
    transaction = Transaction(user_id=user_id, amount=amount, type="withdrawal")
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"msg": "Withdrawal successful", "balance": user.money}), 200

@auth_blueprint.route("/transactions", methods=["GET"])
@jwt_required()
def view_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    return jsonify([
        {"id": t.id, "amount": t.amount, "type": t.type, "timestamp": t.timestamp}
        for t in transactions
    ]), 200

@auth_blueprint.route("/balance", methods=["GET"])
@jwt_required()
def balance():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"balance": user.money}), 200
