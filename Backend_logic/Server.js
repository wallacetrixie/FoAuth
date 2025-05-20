import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const app = express();
const port = 5000;
const saltRounds = 10;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auth',
});
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('MySQL Connected');
});

// 🔐 Register with validation
app.post('/register',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
      .normalizeEmail()
      .isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
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
  }
);

// 🔐 Login with validation and attempt limit
const MAX_ATTEMPTS = 4;
const LOCKOUT_TIME = 5 * 60 * 1000; 

app.post('/login',
  [
    body('email')
      .normalizeEmail()
      .isEmail().withMessage('Invalid email address'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Initialize login attempt tracking in session
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
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        req.session.loginAttempts += 1;
        if (req.session.loginAttempts >= MAX_ATTEMPTS) {
          req.session.lockUntil = now + LOCKOUT_TIME;
          return res.status(429).json({
            success: false,
            message: 'Too many failed attempts. Please try again later.'
          });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        req.session.loginAttempts += 1;
        if (req.session.loginAttempts >= MAX_ATTEMPTS) {
          req.session.lockUntil = now + LOCKOUT_TIME;
          return res.status(429).json({
            success: false,
            message: 'Too many failed attempts. Please try again later.'
          });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      // Successful login — reset attempts
      req.session.loginAttempts = 0;
      req.session.lockUntil = null;
      req.session.user = user;

      return res.status(200).json({ success: true, message: 'Login successful' });
    });
  }
);


// Server listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
