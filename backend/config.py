from datetime import timedelta

SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = 'False'  # Set to True in production with HTTPS
SQLALCHEMY_DATABASE_URI = "sqlite:///trades.db"
JWT_SECRET_KEY = "asdf232fSDF234QFSs" # Should technically be hidden with enviornment variable
JWT_TOKEN_LOCATION = ["headers"]
JWT_IDENTITY_CLAIM = "user_id" 
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)