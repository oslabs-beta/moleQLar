const bcrypt = require('bcryptjs'); 
const db = require('../models/userModels'); 

const userController = {}; 

// Middleware for hashing the password
userController.hashing = async (req, res, next) => {
  const { password } = req.body; // Extract password from request body
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with defined rounds
    const hashWord = await bcrypt.hash(password, salt); // Hash the password using the generated salt
    res.locals.hashWord = hashWord; // Store the hashed password in res.locals for later use
    return next(); // Proceed to the next middleware
  } catch (err) {
    return next({
      // Error handling
      log: 'Error in userController.hashing',
      message: { err: 'Error hashing password' },
    });
  }
};

// Middleware for creating a new user
userController.createUser = async (req, res, next) => {
  const { username, email } = req.body; // Extract username and email from request body
  const hashWord = res.locals.hashWord; // Retrieve hashed password from res.locals

  // Insert credentials into database
  const params = [username, hashWord, email]; // Define parameters for SQL query
  const query = `INSERT INTO users(username, password, email) VALUES ($1, $2, $3) RETURNING *`; // Define SQL query string
  db.query(query, params) // Execute SQL query with parameters
    .then((createdUser) => {
      // Handle successful user creation
      res.locals.user = {
        ...createdUser.rows[0], // Store created user information in res.locals
      };
      return next(); // Proceed to the next middleware
    })
    .catch((err) => {
      // Error handling
      console.log(err);
      return next({
        log: 'Error in userController.createUser',
        status: 500,
        message: { err: 'Error creating user' },
      });
    });
};

// Middleware for logging in a user
userController.loginUser = async (req, res, next) => {
  const { username, password } = req.body; // Extract username and password from request body
  const loginQuery = `SELECT * FROM users WHERE username = '${username}'`; // Define SQL query string

  // Error checking for missing username or password
  if (!username || !password) {
    return next({
      log: 'Error in userController.loginUser, username and password are required',
      message: 'username and password are required',
      status: 400,
    });
  }

  // Validate credentials
  try {
    const result = await db.query(loginQuery); // Query database for user
    const dbPassword = result.rows[0].password; // Save password from database

    // Validate password
    const isMatch = await bcrypt.compare(password, dbPassword); // Compare provided password with stored hash
    if (!isMatch) {
      // Invalid credentials
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Send back user info to the client
    res.locals.user = {
      username: username,
      userId: result.rows[0].user_id,
    }
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `Error in userController.loginUser, ${err}`,
      message: { err: 'Error occurred in post request to /login' },
      status: 500,
    });
  }
};

// Middleware for handling OAuth user creation
userController.handleOAuthUser = async (req, res, next) => {
  const profile = req.user; // Extract profile from request user object

  if (!profile.email) {
    console.error('No email found in Google profile');
    return next({
      log: 'Error in userController.handleOAuthUser',
      message: 'No email found in user profile',
      status: 400,
    });
  }

  const query = `SELECT * FROM users WHERE email = $1`;
  const params = [profile.email];

  try {
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      // User does not exist, create a new user
      const username = profile.displayName;
      const email = profile.email;
      const password = await bcrypt.hash(profile.id, 10); // Hash the profile ID as the password

      const createUserQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
      const createUserParams = [username, email, password];

      const newUser = await db.query(createUserQuery, createUserParams);
      res.locals.user = newUser.rows[0];
    } else {
      // User exists, return the user
      res.locals.user = result.rows[0];
    }

    return next();
  } catch (err) {
    console.error('Error saving OAuth user:', err);
    return next({
      log: 'Error in userController.handleOAuthUser',
      message: 'Error saving OAuth user',
      status: 500,
    });
  }
};

module.exports = userController; 