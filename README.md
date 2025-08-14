# Paper Stock Trading Project

The project is hosted at this link (may contain bugs due to API keys not being maintained): https://papertrader.mooo.com/

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

### Current features (Status: DONE)
Authentication
- Secure login and registration system. Authentication via JWT for persistent sessions.

Stock Search
- Search for stocks using a ticker or company name. Results include live data such as the current stock price, company name, and percentage change. 

Interactive Stock Charts
- Visualize stock performance across different timeframes (1 day, 1 week, 1 month, 6 months, 1 year, and 5 years). Real-time price updates for enhanced trading decisions. 

Buy and Sell Stocks
- Simulate stock trading by buying or selling stocks at the current market price. Instant calculation of total costs or profits based on stock prices. 

Portfolio Tracking
- View all owned stocks with details such as quantity, total value, and performance.Automatically updates with the latest market prices. 

Search Suggestions
- Auto-suggest functionality when searching for stocks. Displays matching tickers and companies based on user input.

Transaction History
- Track all past buy and sell trades. Detailed records of transaction dates, quantities, and prices.
