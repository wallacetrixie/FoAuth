import React, { useState } from 'react';
import { useEffect } from 'react';
import './styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [signupError, setSignupError] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Reset all states
    setLoginEmail('');
    setLoginPassword('');
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setLoginMessage('');
    setLoginError(false);
    setSignupMessage('');
    setSignupError(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    setLoginError(false);
    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: loginEmail,
        password: loginPassword,
      }, { withCredentials: true });

      if (res.data.success) {
        setLoginMessage(res.data.message);
      } else {
        setLoginError(true);
        setLoginMessage(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setLoginError(true);
      setLoginMessage('Server error during login.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage('');
    setSignupError(false);
    try {
      const res = await axios.post('http://localhost:5000/register', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      }, { withCredentials: true });

      if (res.data.success) {
        setSignupMessage(res.data.message);
      } else {
        setSignupError(true);
        setSignupMessage(res.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setSignupError(true);
      setSignupMessage('Server error during signup.');
    }
  };
  // Clear login message after 4 seconds
useEffect(() => {
  if (loginMessage) {
    const timer = setTimeout(() => {
      setLoginMessage('');
      setLoginError(false);
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [loginMessage]);

// Clear signup message after 4 seconds
useEffect(() => {
  if (signupMessage) {
    const timer = setTimeout(() => {
      setSignupMessage('');
      setSignupError(false);
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [signupMessage]);

  return (
    <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
      {/* Login Form */}
      <form className="form sign-in" style={{ display: isSignUp ? 'none' : 'block' }} onSubmit={handleLogin}>
        <h2>Welcome</h2>
        <label className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </label>
        <label className="input-group">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </label>
        {loginMessage && (
          <p className={loginError ? 'error-msg' : 'success-msg'}>{loginMessage}</p>
        )}
        <button type="submit" className="submit">Sign In</button>
      </form>

      {/* Switch Panel */}
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

        {/* Signup Form */}
        <form className="form sign-up" style={{ display: isSignUp ? 'block' : 'none' }} onSubmit={handleSignup}>
          <h2>Create your Account</h2>
          <label className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              required
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </label>
          {signupMessage && (
            <p className={signupError ? 'error-msg' : 'success-msg'}>{signupMessage}</p>
          )}
          <button type="submit" className="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
