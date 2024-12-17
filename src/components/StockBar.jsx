import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function StockBar(props) {
  const { ticker, name, price, percentage } = props;

  // Determine the color based on the percentage
  const percentageColor = percentage >= 0 ? "text-success" : "text-danger";

  return (
    <div className="d-flex justify-content-between align-items-center p-3 mb-2 border rounded shadow-sm bg-light">
      {/* Ticker */}
      <div className="fw-bold">{ticker}</div>

      {/* Company Name */}
      <div className="flex-grow-1 text-center m">{name}</div>

      {/* Price */}
      <div className="me-3">${price.toFixed(2)}</div>

      {/* Percentage Change */}
      <div className={`fw-bold ${percentageColor}`}>
        {percentage >= 0 ? "+" : ""}
        {percentage.toFixed(2)}%
      </div>
    </div>
  );
}

export default StockBar;
