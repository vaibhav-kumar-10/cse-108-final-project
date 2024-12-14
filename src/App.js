import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Main from './components/Main.jsx'
import Transactions from './components/Transactions.jsx'
import Portfolio from './components/Portfolio.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Logout from './components/Logout.jsx'

function App() {

  useEffect(() => {
    async function checkAuthStatus() {
      const response = await fetch('/auth/status', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAuthState({ isLoggedIn: true, user: data.user });
      } else {
        setAuthState({ isLoggedIn: false });
      }
    }
    checkAuthStatus();
  }, []);  

  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </div>
    // <Main />
  );
}

export default App;
