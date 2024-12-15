from datetime import timedelta

SQLALCHEMY_DATABASE_URI = "sqlite:///trades.db"
JWT_SECRET_KEY = "asdf232fSDF234QFSs" # Should technically be hidden with enviornment variable
JWT_TOKEN_LOCATION = ["headers"]
JWT_IDENTITY_CLAIM = "user_id" 
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)