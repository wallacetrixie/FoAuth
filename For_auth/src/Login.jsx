import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [signupError, setSignupError] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Reset all form and message states
    setLoginEmail('');
    setLoginPassword('');
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setLoginMessage('');
    setLoginError(false);
    setSignupMessage('');
    setSignupError(false);
    setShowReset(false);
    setResetPassword('');
    setResetConfirmPassword('');
    setResetError('');
    setResetSuccess('');
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
        setLoginError(false);
        // You might want to redirect or do something after login here
      } else {
        setLoginError(true);
        setLoginMessage(res.data.message || 'Login failed');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(true);
        setLoginMessage(err.response.data.message);
      } else {
        setLoginError(true);
        setLoginMessage('Server error during login.');
      }
      console.error(err);
    }
  };

  // Forgot password handler (frontend only)
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!resetPassword || !resetConfirmPassword) {
      setResetError('Both fields are required');
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    if (resetPassword.length < 8) {
      setResetError('Password must be at least 8 characters');
      return;
    }
    // TODO: Call backend API to reset password
    setResetSuccess('Password reset request sent!');
    setResetPassword('');
    setResetConfirmPassword('');
    setTimeout(() => setShowReset(false), 2000);
  };

  const validateSignup = () => {
    const errors = [];
    if (!signupUsername.trim() || signupUsername.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signupEmail)) {
      errors.push('Invalid email format');
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(signupPassword)) {
      errors.push('Password must be at least 8 characters long, contain an uppercase letter and a number');
    }
    if (signupPassword !== signupConfirmPassword) {
      errors.push('Passwords do not match');
    }
    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage('');
    setSignupError(false);

    const errors = validateSignup();
    if (errors.length > 0) {
      setSignupMessage(errors.join('. '));
      setSignupError(true);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      }, { withCredentials: true });

      if (res.data.success) {
        setSignupMessage(res.data.message);
        setSignupError(false);
      } else {
        setSignupMessage(res.data.message || 'Signup failed');
        setSignupError(true);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setSignupMessage(err.response.data.message);
        setSignupError(true);
      } else {
        setSignupMessage('Server error during signup.');
        setSignupError(true);
      }
      console.error(err);
    }
  };

  // Clear messages after 4 seconds
  useEffect(() => {
    const clearTimer = (msgSetter, errSetter) => {
      const timer = setTimeout(() => {
        msgSetter('');
        errSetter(false);
      }, 4000);
      return () => clearTimeout(timer);
    };
    if (loginMessage) return clearTimer(setLoginMessage, setLoginError);
  }, [loginMessage]);

  useEffect(() => {
    if (signupMessage) {
      const timer = setTimeout(() => {
        setSignupMessage('');
        setSignupError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [signupMessage]);

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        setResetSuccess('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccess]);

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
        <div className="forgot-pass" onClick={() => setShowReset(!showReset)}>
          Forgot Password?
        </div>
        {showReset && (
          <form className="reset-dropdown" onSubmit={handleResetSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={resetPassword}
              onChange={e => setResetPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={resetConfirmPassword}
              onChange={e => setResetConfirmPassword(e.target.value)}
              required
            />
            {resetError && <div className="error-msg">{resetError}</div>}
            {resetSuccess && <div className="success-msg">{resetSuccess}</div>}
            <button type="submit" className="submit">Reset Password</button>
          </form>
        )}
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
          <label className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
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