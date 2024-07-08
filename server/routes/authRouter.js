const express = require('express');
const authRouter = express.Router();

const userController = require('../controllers/userController.js');

// signup route
// TODO -- add cookies and JWT
authRouter.post('/signup',
    userController.hashing,
    userController.createUser,
    userController.generateJWT,
    (req, res) => {
        console.log('Reached /api/auth/signup');
        return res.status(200).json(res.locals.user);
});

// login route
// TODO -- add cookies and JWT
authRouter.post('/login',
    userController.loginUser,
    userController.generateJWT,
    (req, res) => {
        console.log('Reached /api/auth/login');
        return res.status(200).json(res.locals.user);
});

authRouter.post('/protected',
    userController.validateJWT,
    (req, res) => {
        console.log('Reached /api/auth/protected');
        return res.status(200).json(res.locals.user);
    }
)

module.exports = authRouter;