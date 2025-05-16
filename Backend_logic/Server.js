const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db= require("./condig/db");
const { json } = require('body-parser');
const jwt=require('jsonwebtoken');
const SECRET_KEY="TSUSUUHB6vftTO99U8872G{J8";

app.use(cors());
app.use(bodyParser.json());
app.use(
    session(
        {
            secret:SECRET_KEY,
            resave:false,
            saveUninitialized:true,
            cookie:{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                maxAge:3600000,
            },  
        }
    )
)


app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, email, password });
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.status(200).json({ message: 'Login successful' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
