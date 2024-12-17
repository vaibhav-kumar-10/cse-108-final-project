import { useParams } from 'react-router-dom'
import StockChart from './StockChart.jsx'
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';


function StockTrade() {
    const params = useParams();
    const { isLoggedIn } = useAuth(); // Check if user is logged in
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleBuy = async () => {
        setError('');
        setSuccess('');

        if (quantity <= 0) {
            setError('Invalid quantity.');
            return;
        }

        try {
            const authToken = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:7000/auth/buy', {
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
            <h2>{params.ticker}</h2>
            {/* Include the stock chart */}
            <StockChart symbol={params.ticker} />

            {/* Buy Section */}
            {isLoggedIn ? (
                <div className="buy-section mt-4">
                    <h4>Buy Stock</h4>
                    <div className="d-flex align-items-center">
                        <label htmlFor="quantity" className="me-2">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            min="1"
                            className="form-control me-2"
                            style={{ width: '100px' }}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                        <button className="btn btn-success" onClick={handleBuy}>Buy</button>
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