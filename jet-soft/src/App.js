import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClientsPage from './ClientsPage';
import LoginPage from './LoginPage';
import axios from 'axios';
import './App.css';

function App() {
  // state to manage authentication status
  const [auth, setAuth] = useState(false);
  // state to manage token
  const [token, setToken] = useState(null);

  const handleLogin = async (username, password) => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    if (process.env.NODE_ENV === 'development') {
      // mock token for development environment
      setToken('mock-token');
      setAuth(true);
      return true;
    }
    try {
      // send login request to api
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username,
        password,
      });
  
      // set token and authentication status
      setToken(response.data.token);
      setAuth(true);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      return false;
    }
  };
  
  const handleLogout = () => {
    // reset authentication status and token
    setAuth(false);
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* logo for the app */}
          <img src={"jetcorrect.png"} alt="Logo" className="App-logo" />
        </header>
        <div className="sidebar">
          {auth && (
            // link to clients page if authenticated
            <Link to="/clients">
              <button className="sidebar-icon clients-button">
                <img src="clients.png" alt="Clients" />
              </button>
            </Link>
          )}
        </div>

        <div className="main-content">
          {/* routes for the app */}
          <Routes>
            <Route path='/' element={<LoginPage handleLogin={handleLogin} />} />
            <Route path='/clients' element={<ClientsPage auth={auth} token={token} />} />
          </Routes>
        </div>

        <footer className="App-footer">
          <p>© 2023 JetCorrect</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
