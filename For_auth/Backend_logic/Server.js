import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import session from "express-session";
import db from "./db.js";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
const app = express();

const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const isProduction = process.env.NODE_ENV === 'production';
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'fallback_dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  },
});

app.use(express.json());
app.use(sessionMiddleware);

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
