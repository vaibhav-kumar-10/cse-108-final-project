import { useParams} from 'react-router-dom'

function StockTrade() {

    const params = useParams()

    return (
       <div>{params.ticker}</div>
    )
}

export default StockTrade;