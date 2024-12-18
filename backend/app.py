from flask import Flask
from flask_cors import CORS
import os
import argparse

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

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    #app.run(debug=True, port=7000)
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", default=os.environ.get("PORT", 5000), type=int, help="Port to listen on")
    args = parser.parse_args()

    # Run Flask with parsed arguments
    app.run(host=args.host, port=args.port)
