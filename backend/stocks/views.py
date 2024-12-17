from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from stocks.helpers import stock_data_json, get_stock_info

stock_blueprint = Blueprint("stocks", __name__, url_prefix="/stocks")


@stock_blueprint.route("/market/<stock>", methods=["GET"])
@jwt_required()
def get_market_info(stock):
    return stock_data_json(stock)

# t -> Timestamp, o -> Open Price, c -> Close Price, h -> High Price, l -> Low Price, v - > Volume Price
# Pass JSON object with variable time = '1day' or '1week' or '6months' or '1year' or '5years'
@stock_blueprint.route("/stock/<stock>", methods=["PUT"])
@jwt_required()
def get_stock_data(stock):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    time = request.json['time']
    response = None
    if time and time in ['1day', '1week', '6months', '1year', '5years']:
        response = get_stock_info(stock, time)
    else:
        response = get_stock_info(stock)
    return response, 200
