import React, { useState, useEffect } from "react";
import "./Portfolio.css";

function Portfolio() {
    const [portfolioData, setPortfolioData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [sellQuantity, setSellQuantity] = useState("");

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        const url = "http://127.0.0.1:7000/auth/portfolio";
        setLoading(true);
        try {
            const authToken = localStorage.getItem("access_token");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch portfolio");

            const data = await response.json();
            setPortfolioData(data.stocks);
            setSummary({
                totalPortfolioValue: data.total_portfolio_value,
                balance: data.balance,
                percentageChange: data.percentage_change,
            });
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        } finally {
            setLoading(false);
        }
    };

    const openSellModal = (stock) => {
        setSelectedStock(stock);
        setSellQuantity("");
        setShowSellModal(true);
    };

    const closeSellModal = () => {
        setShowSellModal(false);
        setSelectedStock(null);
    };

    const handleSell = async () => {
        if (!sellQuantity || sellQuantity <= 0 || sellQuantity > selectedStock.quantity) {
            alert("Invalid quantity. Please enter a valid number.");
            return;
        }

        const url = "http://127.0.0.1:7000/auth/sell";
        try {
            const authToken = localStorage.getItem("access_token");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stock_ticker: selectedStock.stock,
                    quantity: parseFloat(sellQuantity),
                }),
            });

            if (!response.ok) throw new Error("Failed to sell stock");

            const result = await response.json();
            console.log(result.msg);
            closeSellModal();
            fetchPortfolio();
        } catch (error) {
            console.error("Error selling stock:", error);
        }
    };

    return (
        <div className={`portfolio-container ${showSellModal ? "blur-background" : ""}`}>
            <h2>Portfolio</h2>
            <h4>Your Stocks</h4>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Current Price</th>
                                <th>Percentage Change</th>
                                <th>Total Value</th>
                                <th>Sell</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioData.length > 0 ? (
                                portfolioData.map((stock, index) => (
                                    <tr key={index}>
                                        <td className={stock.percentage_change >= 0 ? "text-green" : "text-red"}>
                                            {stock.stock}
                                        </td>
                                        <td>{stock.name}</td>
                                        <td>{stock.quantity}</td>
                                        <td>${stock.current_price}</td>
                                        <td className={stock.percentage_change >= 0 ? "text-green" : "text-red"}>
                                            {stock.percentage_change}%  
                                        </td>
                                        <td>${stock.total_value}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => openSellModal(stock)}
                                            >
                                                Sell
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No stocks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="summary">
                        <h3>Summary</h3>
                        <p><strong>Total Portfolio Value:</strong> ${summary.totalPortfolioValue}</p>
                        <p><strong>Balance:</strong> ${summary.balance}</p>
                        <p><strong>Percentage Change:</strong> {summary.percentageChange}%</p>
                    </div>
                </>
            )}

            {/* Modal Popup */}
            {showSellModal && selectedStock && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Sell Stock</h3>
                        <p><strong>Stock Name:</strong> {selectedStock.name}</p>
                        <p><strong>Ticker:</strong> {selectedStock.stock}</p>
                        <p><strong>Current Price:</strong> ${selectedStock.current_price}</p>
                        <p><strong>Available Quantity:</strong> {selectedStock.quantity}</p>
                        <label>Enter Quantity:</label>
                        <input
                            type="text"
                            value={sellQuantity}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, ""); // Allow digits only
                                const correctedValue = Math.min(parseInt(value || "0", 10), selectedStock.quantity);
                                setSellQuantity(correctedValue.toString());
                            }}
                            placeholder="Shares to Sell"
                            style={{
                                appearance: "none", 
                                MozAppearance: "textfield",
                                WebkitAppearance: "none",
                            }}
                            min="1"
                            max={selectedStock.quantity}
                        />
                        <p><strong>Total Value:</strong> ${
                            sellQuantity && !isNaN(sellQuantity)
                                ? (sellQuantity * selectedStock.current_price).toFixed(2)
                                : "0.00"
                        }</p>
                        <div className="modal-buttons">
                            <button className="btn btn-danger" onClick={handleSell}>Sell</button>
                            <button className="btn btn-secondary" onClick={closeSellModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Portfolio;
