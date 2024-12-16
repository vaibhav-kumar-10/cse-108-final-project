from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from stocks.helpers import stock_data_json

stock_blueprint = Blueprint("stocks", __name__, url_prefix="/stocks")

@stock_blueprint.route("/market/<stock>", methods=["GET"])
@jwt_required()
def get_market_info(stock):
    return stock_data_json(stock)
    