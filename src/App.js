import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Main from './components/Main.jsx'
import Portfolio from './components/Portfolio.jsx'
import Trade from './components/Trade.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import StockTrade from './components/StockTrade.jsx'
import Transactions from "./components/Transactions.jsx"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trade/:ticker" element={<StockTrade />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
