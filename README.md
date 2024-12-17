# Paper Stock Trading Project

This project is for the CSE108 final. It uses ReactJS, Flask, and SQLAlchemy.

## Clone the repo

First clone the project to use it. Make sure git is installed.
```bash
git clone https://github.com/Remag502/CSE108-FinalProject.git
```

## Frontend Installation
Make sure you have node package manager installed and run

```bash
npm install
```

This will make sure all dependencies within the package.json are installed and up to date.

```bash
npm start
```

Then you can start the server. This should run on localhost:3000

## Backend Installation

Setup a virtual enviornment in Python to run the backend flask server.

```bash
python3 -m venv <myenvpath>
```

Navigate the backend folder and install the dependencies.

```bash
pip install -r requirements.txt
```
And then start the server. This should run on localhost:7000

```bash
python3 app.py
```

### Current features
- Frotend, backend, and databases boiler code are setup
- Login, Register, Logout, Refresh tokens and authentication security works
- Mock pages are there but need to be updated including: home, transactions, portfolio

### Unimplemented Features
- Backend route to get all stock information. First we need to find a library that gets stock information but there should be plenty.
- Database to store user money and transactions. This also means updating the user DB class. We will skip DB migrations for simplicity.
- Chart.js to view stock data. We need some way to parse data of some stock over a few years, and a page the view it. Chart.js is a recommended library.
- Add transaction history route to backend. Allow frontend to view history of transactions. Update home page
- Feature to obtain paper money, purchase and sell stocks. We can avoid adding call options for now. We will also avoid using websocket and rely on REST due to time.
- Host application on a public server.
