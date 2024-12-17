import { useParams } from 'react-router-dom';
import StockChart from './StockChart.jsx';

function StockTrade() {
    const { ticker } = useParams(); // Extract the ticker parameter from the URL

    return (
        <div>
            <h1>Stock Chart for {ticker}</h1>
            <StockChart symbol={ticker} /> {/* Pass the ticker to StockChart */}
        </div>
    );
}

export default StockTrade;