const express = require('express');
const userController = require('../controllers/userController');


const router = express.Router();


router.post(
  "/signup",
  userController.hashing,
  userController.createUser,
  (req, res) => {
    return res.status(200).json(res.locals.createdUser);
  }
);

router.post("/login", userController.verifyUser, (req, res) => {
  return res.status(200).json(res.locals.user);
});

module.exports = router;
