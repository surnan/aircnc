// backend/routes/api/session.js
const bcrypt = require('bcryptjs');
const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { restoreUser, setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


// email field is an empty string
// email field is not an email
// username field is an empty string
// username field is only 3 characters long
// username field is an email
// password field is only 5 characters long
const validateLogin = [
  check('credential').exists({ checkFalsy: true}).notEmpty().withMessage('Email or username is required'),
  check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  handleValidationErrors
];


// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });
  
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error;
    err.message = 'Invalid credentials'
    err.status = 401;
    return next(err)
  }

  const { id, email, username, firstName, lastName } = user;

  const safeUser = {
    id,
    firstName,
    lastName,
    email,
    username
  };

  await setTokenCookie(res, safeUser); //Login Token
  return res.json({user: safeUser});
});


// Log out
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});


// Restore session user
// Gets User Object of current session
router.get('/', (req, res) => {
  const { user } = req;
  const { id, firstName, lastName, email, username } = user

  if (user) {
    const safeUser = {
      id,
      firstName,
      lastName,
      email,
      username
    };
    return res.json({ user: safeUser });
  } else return res.json({ user: null });
});




module.exports = router;