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
      log: 'Error in userController.hasing',
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
        username: createdUser.rows[0],
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

userController.generateJWT = (req, res, next) => {
  console.log('generating JWT');
  // generate JWT
  // state
  const state = { 
    ...res.locals.user,
  }
  const token = jwt.sign(state, JWT_SECRET, { expiresIn: '1h' });
  res.locals.user.token = token;
  return next();
} 

userController.validateJWT = async (req, res, next) => {
  // check that JWT exists in client's local storage
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    // return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // check that token is valid
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // res.json({
    //   message: 'Protected route accessed',
    //   user: req.user
    // }) 
  } catch (err) {
    // res.status(401).json({
    //   message: 'Token is not valid'
    // });
  }
  return next();  // TODO
}

module.exports = userController;