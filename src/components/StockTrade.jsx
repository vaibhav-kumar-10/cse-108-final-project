import { useParams} from 'react-router-dom'
import StockChart from './StockChart.jsx'

function StockTrade() {

    const params = useParams()

    return (
       <div>
        {params.ticker}
        {/* <StockChart symbol="MSFT"/> */}
        </div>
    )
}

export default StockTrade;