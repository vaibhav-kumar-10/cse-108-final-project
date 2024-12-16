import requests
import yfinance as yf
import json

# print(get_all_tickers('lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG'))

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
    
    """
    Fetch stock price percentage changes for multiple tickers and include company names.
    
    Parameters:
        tickers_with_names (list): List of dictionaries with 'ticker' and 'name'.
        period (str): Time period for historical data (default is '5d').
        
    Returns:
        list: List of dictionaries with stock data, company name, and ticker.
    """
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
            
            # Determine trend
            trend = "upward" if percentage_change > 0 else "downward"
            
            # Store data
            data.append({
                "ticker": ticker,
                "name": name,
                "current_price": current_price,
                "previous_price": previous_price,
                "percentage_change": percentage_change,
                "trend": trend,
            })
        except Exception as e:
            print(f"Error fetching data for {ticker} ({name}): {e}")
            data.append({
                "ticker": ticker,
                "name": name,
                "current_price": "Error",
                "previous_price": "Error",
                "percentage_change": "Error",
                "trend": "Error",
            })
    return data

# Replace 'YOUR_API_KEY' with your actual Polygon.io API key
POLYGON_API_KEY = "lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG"

# Step 1: Search for tickers and company names using Polygon.io
search_query = input("Enter the stock you want to search for: ")
# search_query = "apple"  # Search query for tickers
tickers_with_names = search_tickers_polygon(search_query, POLYGON_API_KEY, limit=25)

# Step 2: Fetch stock data for the tickers
if tickers_with_names:
    stock_data = fetch_stock_data(tickers_with_names)
    # print(json.dumps(tickers_with_names))
    marketInfo = [] # Store data in here to jsonify
    for info in stock_data:
        if "Error" in info.values(): # Skip over stocks with errors
            print(f"{info['ticker']} ({info['name']}): Error fetching data")
        else:
            # Jsonify instead of printing
            # print(
            #     f"{info['ticker']} ({info['name']}): Current Price = {info['current_price']:.2f}, "
            #     f"Previous Price = {info['previous_price']:.2f}, "
            #     f"Change = {info['percentage_change']:.2f}% ({info['trend']} trend)"
            # )
            stockInfo = {}
            stockInfo['ticker'] = info['ticker']
            stockInfo['name'] = info['name']
            stockInfo['price'] = info['current_price']
            stockInfo['percentage'] = info['percentage_change']
            marketInfo.append(stockInfo)
            
    marketJson = json.dumps(marketInfo)
    print(marketJson)
    
else:
    print("No valid tickers found.")
