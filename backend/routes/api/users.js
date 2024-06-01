// backend/routes/api/users.js
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');


const validateSignup = [
    check('email').exists({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
    check('username').exists({ checkFalsy: true }).isLength({ min: 4 }).withMessage('Username is required'),
    check('username').not().isEmail().withMessage('Username cannot be an email.'),
    check('firstName').exists({ checkFalsy: true }).isLength({ min: 1 }).withMessage('First Name is required'),
    check('lastName').exists({ checkFalsy: true }).isLength({ min: 1 }).withMessage('Last Name is required'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const emailIsUnique = await User.findOne({ where: { email } })
        const usernameIsUnique = await User.findOne({ where: { username } })

        if (emailIsUnique || usernameIsUnique) {
            const err = new Error;
            err.status = 500;
            err.message = "User already exists"

            // if (emailIsUnique) {
            //     err.errors = { "email": "User with that email already exists" }
            // } else {
            //     err.errors = { "username": "User with that username already exists" }
            // }

            err.errors = emailIsUnique
                ? { "email": "User with that email already exists" }
                : { "username": "User with that username already exists" }

            return next(err)
        }

        const user = await User.create({ email, username, hashedPassword, firstName, lastName });

        const safeUser = {
            id: user.id,
            firstName,
            lastName,
            email,
            username
        };

        await setTokenCookie(res, safeUser);

        return res.json({ user: safeUser });
    } catch (e) {
        next(e)
    }
});

module.exports = router;



/*
router.post('/', validateSignup, async (req, res, next) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const emailIsUnique = await User.findOne({ where: { email } })
        const usernameIsUnique = await User.findOne({ where: { username } })

        if (emailIsUnique || usernameIsUnique) {
            const err = new Error;
            err.status = 500;
            err.message = "User already exists"

            if (emailIsUnique) {
                err.errors = { "email": "User with that email already exists" }
            } else {
                err.errors = { "username": "User with that username already exists" }
            }

            return next(err)
        }

        const user = await User.create({ email, username, hashedPassword, firstName, lastName });

        const safeUser = {
            id: user.id,
            firstName,
            lastName,
            email,
            username
        };

        await setTokenCookie(res, safeUser);

        return res.json({ user: safeUser });
    } catch (e) {
        next(e)
    }
});*/
