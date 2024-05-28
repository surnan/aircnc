// backend/routes/api/session.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');


router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!!!');
});

const latlngPrecision = 6;


//Get all Spots
router.get('/', async (req, res, next) => {
    try {

        const spots = await Spot.findAll({
            include: [{ model: SpotImage }, { model: Review }]
        });

        const result = spots.map(spot => {

            // Preview Image
            let previewImage = spot.SpotImages.find(image => image.isPreview);
            previewImage = previewImage ? previewImage : { url: "No Preview Image Available" }

            // Average Stars
            const totalStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
            const avgRating = spot.Reviews.length ? totalStars / spot.Reviews.length : 0;

            // Create the new spot object
            const { id, ownerId, address, city, state, country, lat, lng } = spot;
            const { name, description, price, createdAt, updatedAt } = spot;

            return {
                id,
                ownerId,
                address,
                city,
                state,
                country,
                lat: lat.toFixed(latlngPrecision),
                lng: lng.toFixed(latlngPrecision),
                name,
                description,
                createdAt,
                updatedAt,
                avgRating: avgRating.toFixed(1),
                previewImage: previewImage.url,
            }
        });
        res.json({ Spots: result })
    } catch (e) {
        next(e)
    }
});

//Get all Spots by current user
// router.get('/current', async (req, res, next) => {
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        // const { user } = req.body
        const { user } = req;

        const spots = await Spot.findAll({
            include: [{ model: SpotImage }, { model: Review }],
            where: {
                ownerId: user.id
            }
        });

        const result = spots.map(spot => {

            // Preview Image
            let previewImage = spot.SpotImages.find(image => image.isPreview);
            previewImage = previewImage ? previewImage : { url: "No Preview Image Available" }

            // Average Stars
            const totalStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
            const avgRating = spot.Reviews.length ? totalStars / spot.Reviews.length : 0;

            // Create the new spot object
            const { id, ownerId, address, city, state, country, lat, lng } = spot;
            const { name, description, price, createdAt, updatedAt } = spot;

            return {
                id,
                ownerId,
                address,
                city,
                state,
                country,
                lat: lat.toFixed(latlngPrecision),
                lng: lng.toFixed(latlngPrecision),
                name,
                description,
                createdAt,
                updatedAt,
                avgRating: avgRating.toFixed(1),
                previewImage: previewImage.url,
            }
        })

        res.json({ Spots: result })
    } catch (e) {
        next(e)
    }
});


//Get details of a Spot from an Id
router.get('/:spotId', async (req, res, next) => {

    try {
        const { spotId } = req.params
        const currentSpot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: Review,
                    attributes: ['stars']
                }, {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                },
            ]
        })


        // Average Stars
        const totalStars = currentSpot.Reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = currentSpot.Reviews.length ? totalStars / currentSpot.Reviews.length : 0;

        const { id, ownerId, address, city, state, country, lat, lng } = currentSpot;
        const { name, description, price, createdAt, updatedAt, Owner } = currentSpot;


        const result = {
            id,
            ownerId,
            address,
            city,
            state,
            country,
            lat: lat.toFixed(latlngPrecision),
            lng: lng.toFixed(latlngPrecision),
            name,
            description,
            price,
            createdAt,
            updatedAt,
            numReviews: currentSpot.Reviews.length,
            avgStarRating: avgRating.toFixed(1),
            SpotImages: currentSpot.SpotImages,
            Owner
        }

        res.json(result)
    } catch (e) {
        next(e)
    }
})

//Create a Spot
// router.post('/', async (req, res, next) => {
router.post('/', requireAuth, async (req, res, next) => {

    try {
        // const { user } = req.body
        const { user } = req;
        const { lat, lng, address, name, country, city, state, description, price } = req.body;

        const spot = await Spot.create(
            {
                ownerId: user.id,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            }
        )
        res.status(201).json(spot)
    } catch (e) {
        next(e)
    }
})


module.exports = router;