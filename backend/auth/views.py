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
from stocks.helpers import current_stock_price, fetch_stock_data, STOCK_PRICE_CACHE
from stocks.helpers import preload_stock_prices



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
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None or not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad credentials"}), 400
    # Generate tokens and add to database
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    add_token_to_database(access_token)
    add_token_to_database(refresh_token)

    common_stock_tickers = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA"]
    preload_stock_prices(common_stock_tickers)

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

@auth_blueprint.route("/transactions", methods=["GET"])
@jwt_required()
def view_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    return jsonify([
        {"id": t.user_transaction_id, "amount": t.amount, "type": t.type, "timestamp": t.timestamp}
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


@auth_blueprint.route("/buy", methods=["POST"])
@jwt_required()
def buy_stock():
    user_id = get_jwt_identity()
    data = request.get_json()

    stock_ticker = data.get("stock_ticker")
    quantity = data.get("quantity")

    if not stock_ticker or not quantity or quantity <= 0:
        return jsonify({"msg": "Invalid input"}), 400

    stock_info = current_stock_price(stock_ticker)
    if "error" in stock_info:
        return jsonify({"msg": "Error fetching stock price"}), 400

    stock_price = stock_info["price"]
    total_cost = stock_price * quantity

    user = User.query.get(user_id)
    if user.money < total_cost:
        return jsonify({"msg": "Insufficient balance"}), 400
    
    last_transaction = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.user_transaction_id.desc()).first()
    next_user_transaction_id = 1 if not last_transaction else last_transaction.user_transaction_id + 1


    user.money -= total_cost
    transaction = Transaction(
        user_id=user_id,
        user_transaction_id=next_user_transaction_id,
        amount=-total_cost,
        type=f"buy-{stock_ticker}"
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({"msg": f"Bought {quantity} shares of {stock_ticker}", "balance": round(user.money, 2) }), 200



@auth_blueprint.route("/sell", methods=["POST"])
@jwt_required()
def sell_stock():
    user_id = get_jwt_identity()
    data = request.get_json()

    stock_ticker = data.get("stock_ticker")
    quantity = data.get("quantity")

    if not stock_ticker or not quantity or quantity <= 0:
        return jsonify({"msg": "Invalid input"}), 400

    stock_info = current_stock_price(stock_ticker)
    if "error" in stock_info:
        return jsonify({"msg": "Error fetching stock price"}), 400

    stock_price = stock_info["price"]
    total_value = stock_price * quantity

    user = User.query.get(user_id)

    last_transaction = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.user_transaction_id.desc()).first()
    next_user_transaction_id = 1 if not last_transaction else last_transaction.user_transaction_id + 1

    user.money += total_value
    transaction = Transaction(
        user_id=user_id,
        user_transaction_id=next_user_transaction_id,
        amount=total_value,
        type=f"sell-{stock_ticker}"
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({"msg": f"Sold {quantity} shares of {stock_ticker}", "balance": round(user.money, 2)}), 200

@auth_blueprint.route("/portfolio", methods=["GET"])
@jwt_required()
def portfolio():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    holdings = {}
    for t in transactions:
        stock_ticker = t.type.split("-")[1]

        # Fetch stock info since we need it to display
        stock_info = STOCK_PRICE_CACHE.get(stock_ticker)
        if not stock_info:
            stock_info = current_stock_price(stock_ticker)
            if stock_info and "price" in stock_info:
                STOCK_PRICE_CACHE[stock_ticker] = stock_info
        
        if stock_info and "price" in stock_info:
            price = stock_info["price"]
            if t.type.startswith("buy-"):
                holdings[stock_ticker] = holdings.get(stock_ticker, 0) + abs(t.amount / price)
            elif t.type.startswith("sell-"):
                holdings[stock_ticker] = holdings.get(stock_ticker, 0) - abs(t.amount / price)

    #Gets rid of useless stocks
    current_holdings = {ticker: qty for ticker, qty in holdings.items() if qty > 0}

    tickers_with_names = [{"ticker": ticker, "name": ticker} for ticker in current_holdings.keys()]
    stock_data = fetch_stock_data(tickers_with_names)

    stock_summary = []
    portfolio_value = 0

    for stock in stock_data:
        ticker = stock["ticker"]
        name = stock["name"] 
        current_price = stock["price"]
        percentage_change = stock["percentage"]
        quantity = round(current_holdings.get(ticker, 0), 2)

        if quantity > 0:
            total_value = round(current_price * quantity, 2)
            portfolio_value += total_value

            stock_summary.append({
                "stock": ticker,
                "name": name,
                "quantity": quantity,
                "current_price": round(current_price, 2),
                "percentage_change": round(percentage_change, 2),
                "total_value": total_value
            })

    balance = round(user.money, 2)
    total_value_now = portfolio_value + balance
    percentage_change_portfolio = ((total_value_now - 10000) / 10000) * 100

    return jsonify({
        "stocks": stock_summary,
        "total_portfolio_value": round(portfolio_value, 2),
        "balance": balance,
        "percentage_change": 0.0 if portfolio_value == 0 else round(percentage_change_portfolio, 2)
    }), 200
