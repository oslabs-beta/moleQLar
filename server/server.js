require('dotenv').config(); // Add this line at the very top of the file

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const cors = require('cors');
const config = require('./config');
const db = require('./models/userModels'); // Import the database models
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT creation/validation
const userController = require('./controllers/userController'); // Import the user controller

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
  const query = `SELECT * FROM auth.users WHERE email = $1`;
  const params = [profile.emails[0].value];

  try {
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      // User does not exist, create a new user
      const id = uuidv4();  // Generate a new UUID
      const email = profile.emails[0].value;
      const password = await bcrypt.hash(profile.id, 10); // Hash the profile ID as the password

      const createUserQuery = `INSERT INTO auth.users (id, email, encrypted_password, role) VALUES ($1, $2, $3, 'authenticated') RETURNING *`;
      const createUserParams = [id, email, password];

      const newUser = await db.query(createUserQuery, createUserParams);
      const user = newUser.rows[0];

      done(null, { id: user.id, email: user.email });
    } else {
      // User exists, return the user
      const user = result.rows[0];
      done(null, { id: user.id, email: user.email });
    }
  } catch (err) {
    done(err, null);
  }
}));

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.handleOAuthUser, async (req, res) => {
  console.log('Authentication successful');

  const userProfile = req.user;
  console.log('Authenticated user profile:', userProfile);

  if (!userProfile.email) {
    console.error('No email found in Google profile');
    return res.redirect('/login');
  }

  const email = userProfile.email;
  const userId = userProfile.id;

  // Check if the user already exists
  const userExistsQuery = `SELECT * FROM auth.users WHERE email = $1`;
  const params = [email];

  try {
    const userExistsResult = await db.query(userExistsQuery, params);

    if (userExistsResult.rows.length === 0) {
      // User doesn't exist, create a new one
      const id = uuidv4();  // Generate a new UUID
      const createUserQuery = `
        INSERT INTO auth.users (id, email)
        VALUES ($1, $2)
        RETURNING *`;
      const createUserParams = [id, email];

      const newUser = await db.query(createUserQuery, createUserParams);
      console.log('New user created:', newUser.rows[0]);
    } else {
      console.log('User already exists:', userExistsResult.rows[0]);
    }

    // Create and send JWT token
    const token = jwt.sign({ id: userId, email }, config.jwt.secret, { expiresIn: '1h' });
    res.setHeader('authorization', `Bearer ${token}`);

    res.redirect('http://localhost:8000/dashboard');
  } catch (err) {
    console.error('Error saving OAuth user:', err);
    res.redirect('/login');
  }
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