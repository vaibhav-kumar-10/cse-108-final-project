import { useParams } from 'react-router-dom'
import StockChart from './StockChart.jsx'
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from "react-router-dom";


function StockTrade() {
    const params = useParams();
    const { isLoggedIn } = useAuth(); // Check if user is logged in
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [timeDuration, setTimeDuration] = useState("1d");
    const location = useLocation();
    const { price, name } = location.state || {};

    const handleToggle = (duration) => {
        setTimeDuration(duration);
    };

    const handleBuy = async () => {
        setError('');
        setSuccess('');

        if (quantity <= 0) {
            setError('Invalid quantity.');
            return;
        }

        try {
            const authToken = localStorage.getItem('access_token');
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}/auth/buy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stock_ticker: params.ticker, // Ticker from URL
                    quantity: quantity, // User-input quantity
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`Successfully purchased stock! Remaining balance: $${data.balance}`);
            } else {
                const errorData = await response.json();
                setError(errorData.msg || 'Failed to purchase stock.');
            }
        } catch (error) {
            console.error('Error during purchase:', error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>{name}</h2>

            {/* Include the stock chart */}
            <StockChart symbol={params.ticker} timeDuration={timeDuration}/>

            {/* Buy Section */}
            {isLoggedIn ? (
                <div className="buy-section mt-4">
                    <h4>Buy Stock</h4>

                    <div className="d-flex align-items-center">
                        {/* Toggle Button Section */}
                        <div className="btn-group me-3 col-3" role="group" aria-label="Time Duration">
                            {["1d", "1w", "6m", "1y", "5y"].map((duration) => (
                                <button
                                    key={duration}
                                    type="button"
                                    className={`btn btn-outline-primary ${
                                        timeDuration === duration ? "active" : ""
                                    }`}
                                    onClick={() => handleToggle(duration)}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>

                        <div className='col-2'> 
                            {/* White Space*/}
                        </div>

                        {/* Quantity Input */}
                        <label htmlFor="quantity" className="me-2 ">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            min="1"
                            className="form-control me-2"
                            style={{ width: "100px" }}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />

                        {/* Buy Button */}
                        <button className="btn btn-success" onClick={handleBuy}>
                            Buy ${(price * quantity).toFixed(2)}
                        </button>
                    </div>

                    {success && <p className="text-success mt-2">{success}</p>}
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            ) : (
                <p className="text-warning">You must be logged in to buy stocks.</p>
            )}
        </div>
    );
}

export default StockTrade;