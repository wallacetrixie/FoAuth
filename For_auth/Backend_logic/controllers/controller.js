import bcrypt from 'bcrypt';
import db from '../db.js';
import { validationResult } from 'express-validator';
const saltRounds = 10;
const MAX_ATTEMPTS = 4;
const LOCKOUT_TIME = 5 * 60 * 1000;

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        return res.status(500).json({ success: false, message: 'Database error', error: err });
      }
      return res.status(201).json({ success: true, message: 'User registered successfully' });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  if (!req.session.loginAttempts) {
    req.session.loginAttempts = 0;
    req.session.lockUntil = null;
  }

  const now = Date.now();
  if (req.session.lockUntil && now < req.session.lockUntil) {
    const remaining = Math.ceil((req.session.lockUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many failed attempts. Please try again in ${remaining} seconds.`
    });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length === 0) {
      req.session.loginAttempts += 1;
      if (req.session.loginAttempts >= MAX_ATTEMPTS) {
        req.session.lockUntil = now + LOCKOUT_TIME;
        return res.status(429).json({ success: false, message: 'Too many failed attempts. Try again later.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.session.loginAttempts += 1;
      if (req.session.loginAttempts >= MAX_ATTEMPTS) {
        req.session.lockUntil = now + LOCKOUT_TIME;
        return res.status(429).json({ success: false, message: 'Too many failed attempts. Try again later.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    req.session.loginAttempts = 0;
    req.session.lockUntil = null;
    req.session.user = user;

    return res.status(200).json({ success: true, message: 'Login successful' });
  });
};