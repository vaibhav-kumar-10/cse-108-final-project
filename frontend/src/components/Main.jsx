import React, { useState } from 'react';
import '../App.css';

function Main() {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartCoords({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startCoords.x;
        const deltaY = e.clientY - startCoords.y;

        setRotation((prevRotation) => ({
            x: prevRotation.x + deltaY * 0.8, // Sensitivity
            y: prevRotation.y + deltaX * 0.8,
        }));

        setStartCoords({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };


    return (
        <div
            className="full-page"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="zoomed-graph">
                <iframe
                    src="https://s.tradingview.com/widgetembed/?symbol=COINBASE:BTCUSD&interval=D&theme=dark&style=1&locale=en&hide_side_toolbar=true&hide_top_toolbar=true&save_image=false"
                    title="Bitcoin Live Graph"
                ></iframe>
            </div>
            <div
                className="fade-text interactive-text"
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                Paper  ͡° ͜ʖ ͡°
            </div>
        </div>
    );
}

export default Main;

