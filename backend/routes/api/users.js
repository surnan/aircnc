// backend/routes/api/users.js
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');


// email field is an empty string
// email field is not an email
// username field is an empty string
// username field is only 3 characters long
// username field is an email
// password field is only 5 characters long

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Please provide a username with at least 4 characters.'),

    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
        id: user.id,
        firstName,
        lastName,
        email,
        username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});






module.exports = router;