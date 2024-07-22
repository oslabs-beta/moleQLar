const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build'))); // Serve static files from the React app

// Session setup
app.use(
  session({
    secret: config.session.cookieKey,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Save user to your database or session here
      done(null, profile);
    }
  )
);

// app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'build')));

// app.get("/testdb", async (req, res) => {
//   const result = await db.query("SELECT * FROM users LIMIT 1");
//   console.log("result", result);
//   res.status(200).json(result);
// });

// Authorization Route
const authRouter = require('./routes/authRouter');
app.use('/api/auth', authRouter);

// Graph Routes
const graphRouter = require('./routes/graphRouter');
app.use('/api/graph', graphRouter);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.log('GLOBAL ERROR HANDLER:', err);
  const defaultErr = {
    log: 'Express error handler caught middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

module.exports = app;
