// backend/routes/api/reviews.js

const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');


router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!!!');
});

const avgStarPrecision = 1;
const latlngPrecision = 6;


//Get current user reviews
router.get('/current', async (req, res, next) => {
    // router.get('/', requireAuth, async (req, res, next) => {
    try {

        const safeUser = { id: 2 };
        const reviews = await Review.findAll(
            {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: Spot,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ],
                where: {
                    userId: safeUser.id
                }
            }
        )
        res.json({ Reviews: reviews })
    } catch (e) {
        next(e)
    }
})

// router.post('/', requireAuth, validateSpot, async(req, res) => {
router.post('/', async (req, res) => {

    // const {user} = req;
    const user = { id: 1 };

    const {lat, lng, address, name, country, city, state, description, price} = req.body

    const spot = await Spot.create(
        {
            lat, 
            lng,
            ownerId: user.id,
            address,
            name,
            country,
            city,
            state,
            description,
            price,
        }
    );

    res.status(201).json(spot);
});

module.exports = router;