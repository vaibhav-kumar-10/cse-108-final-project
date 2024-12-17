import { useState } from "react";
import { useEffect } from "react";
import StockBar from "./StockBar";
import { useAuth } from "../contexts/AuthContext"; 

function Portfolio() {
    const [searchQuery, setSearchQuery] = useState("*"); // To track the search input
    const [stocks, setStocks] = useState([]); // To track the fetched stocks
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchStocks();
        setSearchQuery("");
    }, []);

    const searchStocks = async () => {
        if (!searchQuery.trim()) return; // Prevent empty queries
        
        setLoading(true);
        const url = `http://127.0.0.1:7000/stocks/market/${searchQuery}`;

        try {
            const authToken = localStorage.getItem('access_token');
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch stocks");

            const data = await response.json(); // Assuming the API returns an array of stock objects
            setStocks(data); // Update the stocks state with the fetched data
        } catch (error) {
            console.error("Error fetching stocks:", error);
            setStocks([]); // Clear the results in case of an error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
                <h3 className="me-3 col-8 text-start">Stock Market</h3>
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search input
                    onKeyDown={(e) => e.key === "Enter" && searchStocks()} // Search through stocks
                />
                <button className="btn btn-primary" type="button" onClick={searchStocks}>
                    Search
                </button>
            </div>

            {/* Loading Spinner */}
            {loading && <div className="spinner-border text-primary" role="status"></div>}

            {/* Dynamically render StockBar components */}
            {!loading &&
                stocks.map((stock, index) => (
                    <StockBar
                        key={index}
                        ticker={stock.ticker}
                        name={stock.name}
                        price={stock.price}
                        percentage={stock.percentage}
                    />
                ))}
        </div>
    );
}

export default Portfolio;
