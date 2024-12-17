import requests
import yfinance as yf
import json
from datetime import datetime, timedelta

POLYGON_API_KEY = "lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG"

def search_tickers_polygon(query, api_key, limit=10):
    url = "https://api.polygon.io/v3/reference/tickers"
    params = {
        "market": "stocks",
        "active": True,
        "limit": limit,
        "apiKey": api_key,
    }
    if query != "*":
        params["sort"] = "ticker",
        params["oprder"] = "asc",
        params["search"] = query
        params["limit"] = 100
        
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        # Extract ticker and company name from the results
        return [
            {"ticker": item["ticker"], "name": item["name"]}
            for item in data.get("results", [])
            if item["market"] == "stocks"
        ]
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return []

def fetch_stock_data(tickers_with_names, period="5d"):
    data = []
    for item in tickers_with_names:
        ticker = item["ticker"]
        name = item["name"]
        try:
            stock = yf.Ticker(ticker)
            history = stock.history(period=period)
            # Ensure we have enough data
            if len(history) < 2:
                print(f"Skipping {ticker} ({name}): Not enough historical data.")
                continue    
            # Calculate current and previous close prices using iloc
            current_price = history["Close"].iloc[-1]
            previous_price = history["Close"].iloc[-2]
            percentage_change = ((current_price - previous_price) / previous_price) * 100    
            # Store data
            data.append({
                "ticker": ticker,
                "name": name,
                "price": current_price,
                "percentage": percentage_change,
            })
        except Exception as e: # Dont add broken stock data
            pass
    return data

def stock_data_json(search_query):
    tickers_with_names = search_tickers_polygon(search_query, POLYGON_API_KEY, limit=25)
    stock_data = fetch_stock_data(tickers_with_names)
    return json.dumps(stock_data)

def get_stock_info(ticker, timespan="1day"):
    polygonAPIkey = 'lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG'
    
    # Calculate start date based on timespan
    end_date = datetime.now()
    if timespan == "1day":
        start_date = end_date - timedelta(days=1)
        resolution = "minute"
        multiplier = 5  # 5-minute intervals
    elif timespan == "1week":
        start_date = end_date - timedelta(weeks=1)
        resolution = "hour"
        multiplier = 1  # Hourly data
    elif timespan == "1month":
        start_date = end_date - timedelta(days=30)
        resolution = "day"
        multiplier = 1  # Daily data
    elif timespan == "6months":
        start_date = end_date - timedelta(days=182)
        resolution = "day"
        multiplier = 1
    elif timespan == "1year":
        start_date = end_date - timedelta(days=365)
        resolution = "day"
        multiplier = 1
    elif timespan == "5years":
        start_date = end_date - timedelta(days=1825)
        resolution = "month"
        multiplier = 1  # Monthly data
    else:
        raise ValueError("Invalid timespan. Use '1day', '1week', '1month', '6months', '1year', or '5years'.")

    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')

    # Fetch data
    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/{multiplier}/{resolution}/{start_date_str}/{end_date_str}?apiKey={polygonAPIkey}"    
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        
        # Extract only the 'results' field
        if "results" in data:
            return data["results"]  # Extracted array of stock data points
        else:
            print("No stock data available.")
            return []
    else:
        print(f"Error: {response.status_code}")
        return None