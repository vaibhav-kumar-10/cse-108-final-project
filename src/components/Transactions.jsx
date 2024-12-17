import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Transactions() {
    const { logout } = useAuth(); // Logout function from AuthContext
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error("No access token found");
                }
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                const response = await fetch(`${backendUrl}/auth/transactions`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    logout();
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch transaction history');
                }

                const data = await response.json();
                if (data.length === 0) {
                    setTransactions([]); // Explicitly set to empty array
                } else {
                    setTransactions(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Stop loading spinner
            }
        };

        fetchTransactions();
    }, [logout, navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading spinner
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Transaction History</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {transactions.length > 0 ? (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.id}</td>
                                <td>${tx.amount.toFixed(2)}</td>
                                <td>{tx.type}</td>
                                <td>{tx.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p> 
            )}
        </div>
    );
}

export default Transactions;
