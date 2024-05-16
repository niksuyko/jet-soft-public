import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ handleLogin }) {
  // state for username input
  const [username, setUsername] = useState('');
  // state for password input
  const [password, setPassword] = useState('');
  // state for error message
  const [errorMessage, setErrorMessage] = useState('');
  // initialize navigation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call handleLogin with username and password
    const success = await handleLogin(username, password);
    if (success) {
      // navigate to clients page if login is successful
      navigate('/clients');
    } else {
      // display error message if login fails
      setErrorMessage('Incorrect username or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {/* display error message if present */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
