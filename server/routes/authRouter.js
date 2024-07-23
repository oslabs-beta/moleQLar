const express = require('express');
const authRouter = express.Router();

const userController = require('../controllers/userController.js');

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// signup route
authRouter.post('/signup',
  userController.hashing,
  userController.createUser,
  (req, res) => {
    console.log('Reached /api/auth/signup');
    return res.status(200).json(res.locals.user);
});

// login route
authRouter.post('/login',
  userController.loginUser,
  (req, res) => {
    console.log('Reached /api/auth/login');
    return res.status(200).json(res.locals.user);
});

// Protected route example
authRouter.post('/protected',
  ensureAuthenticated,
  (req, res) => {
    console.log('Reached /api/auth/protected');
    // success - valid session
    return res.status(200).json(req.user);
  }
);

module.exports = authRouter;