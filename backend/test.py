# # -*- coding: utf-8 -*-
# """
# get historical stock price data in python with polygon.io API
# @author: adam getbags
# """

# #pip OR conda install
# #pip install polygon-api-client
# #pip install plotly

# #import modules
# from polygon import RESTClient # polygon
# import datetime as dt
# import pandas as pd
# import plotly.graph_objects as go
# from plotly.offline import plot # plotly

# #api key from config
# # from polygonAPIkey import polygonAPIkey
# # OR just assign your API as a string variable
# polygonAPIkey = 'lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG'

# # create client and authenticate w/ API key // rate limit 5 requests per min
# client = RESTClient(polygonAPIkey) # api_key is used

# stockTicker = 'MSFT'

# # daily bars
# dataRequest = client.get_aggs(ticker = stockTicker, 
#                               multiplier = 1,
#                               timespan = 'day',
#                               from_ = '2022-09-01',
#                               to = '2100-01-01')

# # five minute price bars
# # dataRequest = client.get_aggs(ticker = stockTicker, 
# #                               multiplier = 5,
# #                               timespan = 'minute',
# #                               from_ = '2023-02-24',
# #                               to = '2100-01-01')

# # two hour price bars
# # dataRequest = client.get_aggs(ticker = stockTicker, 
# #                               multiplier = 2,
# #                               timespan = 'hour',
# #                               from_ = '2023-01-15',
# #                               to = '2100-01-01')

# # print(dataRequest) # Lots of data


# ## Generate the graph 
# # list of polygon agg objects to DataFrame
# priceData = pd.DataFrame(dataRequest)

# #create Date column
# priceData['Date'] = priceData['timestamp'].apply(
#                           lambda x: pd.to_datetime(x*1000000))

# priceData = priceData.set_index('Date')

# #generate plotly figure
# fig = go.Figure(data=[go.Candlestick(x=priceData.index,
#                 open=priceData['open'],
#                 high=priceData['high'],
#                 low=priceData['low'],
#                 close=priceData['close'])])

# #open figure in browser
# plot(fig, auto_open=True)

import requests

# API Key and stock ticker
polygonAPIkey = 'lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG'
stockTicker = 'MSFT'

# Define parameters for the request
base_url = "https://api.polygon.io/v2/aggs/ticker"
timespan = "day"
start_date = "2022-09-01"
end_date = "2100-01-01"

# Construct the URL
url = f"{base_url}/{stockTicker}/range/1/{timespan}/{start_date}/{end_date}?apiKey={polygonAPIkey}"

# Make the request
response = requests.get(url)

# Check for errors
if response.status_code == 200:
    data = response.json()
    # print("Data Retrieved Successfully!")
    print(data)
else:
    print(f"Error: {response.status_code} - {response.text}")
