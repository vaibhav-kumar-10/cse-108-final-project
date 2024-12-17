import requests
import yfinance as yf
import json

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