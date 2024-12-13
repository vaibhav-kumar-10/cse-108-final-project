from flask import Flask, request, redirect, url_for
from flask_login import LoginManager, current_user, login_user
from database import User

app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
app.secret_key = 'keep it secret, keep it safe' # Add this to avoid an 

@app.route('/login', methods=['POST'])
def login():
    # if request.method == 'POST':
    #     username = request.form['username']
    #     password = request.form['password']
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    user = User.query.filter_by(username=request.json['username']).first()
    if user is None or not user.check_password(request.json['password']):
        print('Couldnt log in user!')
        return redirect(url_for('login'))
    login_user(user)
    return redirect(url_for('index'))
