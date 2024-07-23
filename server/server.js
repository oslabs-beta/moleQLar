require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const cors = require('cors');
const config = require('./config');
const db = require('./models/userModels'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); 
const userController = require('./controllers/userController'); 

// Routes
const authRouter = require('./routes/authRouter');
const graphRouter = require('./routes/graphRouter');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));
app.use(express.static(path.join(__dirname, '../client/build')));

// Session setup
app.use(session({
  secret: config.session.cookieKey,
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google profile:', JSON.stringify(profile, null, 2));

  // Check if user exists in the database
  const query = `SELECT * FROM users WHERE email = $1`;
  const params = [profile.emails[0].value];

  try {
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      // User does not exist, create a new user
      const username = profile.displayName;
      const email = profile.emails[0].value;
      const password = await bcrypt.hash(profile.id, 10); // Hash the profile ID as the password

      const createUserQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
      const createUserParams = [username, email, password];

      const newUser = await db.query(createUserQuery, createUserParams);
      done(null, newUser.rows[0]);
    } else {
      // User exists, return the user
      done(null, result.rows[0]);
    }
  } catch (err) {
    done(err, null);
  }
}));

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.handleOAuthUser, (req, res) => {
  console.log('Authentication successful');

  const userProfile = req.user;
  console.log('Authenticated user profile:', userProfile);

  if (!userProfile.email) {
    console.error('No email found in Google profile');
    return res.redirect('/login');
  }

  res.redirect('http://localhost:8000/dashboard');
});

app.get('/api/auth/status', (req, res) => {
  res.json({
    isAuth: !!req.user,
    user_id: req.user ? req.user.id : null,
    email: req.user ? req.user.email : '',
  });
});

app.use('/api/auth', authRouter);  // Use authRouter for authentication routes
app.use('/api/graph', graphRouter);  // Use graphRouter for graph-related routes

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});