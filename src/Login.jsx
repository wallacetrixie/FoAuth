// src/Login.jsx
import React, { useState } from 'react';
import './styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignUp
      ? 'http://localhost:5000/register'
      : 'http://localhost:5000/login';

    const body = isSignUp
      ? { username, password }
      : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Something went wrong.');
        return;
      }

      if (isSignUp) {
        alert('Successfully signed up!');
      } else {
        alert('Login successful!');
        // Optional: redirect logic here
        // e.g., window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error('Fetch error:', err);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
      <form className="form sign-in" onSubmit={handleFormSubmit}>
        <h2>Welcome</h2>
        <label className="input-group">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="input-group">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="submit">Sign In</button>
      </form>

      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>
          <div className="img__btn" onClick={toggleMode}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        <form className="form sign-up" onSubmit={handleFormSubmit}>
          <h2>Create your Account</h2>
          <label className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
