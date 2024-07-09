const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/userModels');

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'moleQLar';
const userController = {};

userController.hashing = async (req, res, next) => {
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashWord = await bcrypt.hash(password, salt);
    res.locals.hashWord = hashWord;
    return next();
  } catch (err) {
    return next({
      log: 'Error in userController.hashing',
      message: { err: 'Error hashing password' },
    });
  }
};

userController.createUser = async (req, res, next) => {
  const { username, email } = req.body;
  const hashWord = res.locals.hashWord;

  // TODO - check that username doesn't already exist

  // insert credentials into database
  const params = [username, hashWord, email];
  const query = `INSERT INTO users(username, password, email) VALUES ($1, $2, $3) RETURNING *`;
  db.query(query, params)
    .then((createdUser) => {
      res.locals.user = {
        ...createdUser.rows[0],
      }
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next({
        log: 'Error in userController.createUser',
        status: 500,
        message: { err: 'Error creating user'},
      });
    });
};

userController.loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const loginQuery = `SELECT * FROM users WHERE username = '${username}'`;
  console.log('username:', username);
  console.log('password:', password);
  // error checking
  if (!username || !password) {
    return next({
      log: 'Error in userController.loginUser, username and password are required',
      messgae: 'username and password are required',
      status: 400
    });
  }
  // vaidate credentials
  try {
    const result = await db.query(loginQuery);  // query db for user
    const dbPassword = result.rows[0].password;  // save password
    // validate password
    const isMatch = await bcrypt.compare(password, dbPassword);
    if (isMatch) res.locals.user = { username };
    else {
      // invalid credentials
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `Error in userController.loginUser, ${err}`,
      message: { err: "Error occurred in post request to /login" },
      status: 500,
    });
  }
};

userController.signJWT = (req, res, next) => {
  console.log('userController.signJWT - signing JWT');
  // generate JWT
  // state
  const state = { 
    ...res.locals.user,
  }
  // sign token
  const token = jwt.sign(state, JWT_SECRET, { expiresIn: '1h' });
  // add token to response header
  res.setHeader('authorization', `Bearer ${token}`);
  return next();
} 

userController.validateJWT = async (req, res, next) => {
  console.log('userController.validateJWT');
  // check that JWT exists in client's local storage
  const token = req.headers['authorization'].replace('Bearer ', '');
  if (token === 'null' && !JSON.parse(token)) {
    console.log('No token found');
    // denied - no token
    res.locals.user = null;
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  // check that token is valid
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // success
    // send username back to the client
    res.locals.user = { username: decoded.username }
    return next();
  } catch (err) {
    console.log('userController - err.name:', err.name)
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, authorization denied' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = userController;