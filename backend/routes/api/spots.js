// backend/routes/api/session.js
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Spot, User } = require('../../db/models');


router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!!!');
});


// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {username: 'Demo-lition'}});
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

//Get all Spots
router.get('/', async (req, res, next) => {
    try {
        const allSpots = await Spot.findAll();
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.json({ Spots: allSpots });
    } catch (err) {
        next(err)
    }
});

//Get all Spots by current user
router.get('/current', requireAuth, async (req, res, next) => {
    console.log("1")
    res.json("hello world");
});

module.exports = router;