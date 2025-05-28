import session from "express-session";
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  },
});

export default sessionMiddleware;
