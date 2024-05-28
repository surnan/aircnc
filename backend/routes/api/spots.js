// backend/routes/api/session.js

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




//Get all Spots
const validateSpot = [
    check('address').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).isString().notEmpty().withMessage('City is required'),
    check('state').exists({ checkFalsy: true }).isString().notEmpty().withMessage('State is required'),
    check('country').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Country is required.'),
    check('lat').exists({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage('Latitude must be within -90 and 90'),
    check('lng').exists({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage('Longitude must be within -180 and 180'),
    check('name').exists({ checkFalsy: true }).isString().isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true }).notEmpty().withMessage('Description is required'),
    check('price').exists({ checkFalsy: true }).isFloat({ min: 0, max: 2000 }).withMessage('Price per day must be a positive number'),
    //Without this entry, errors above enter body but just sit there like an appended string
    //handleValidationErrors searches REQ for validation errors
    //This line/function is the ONLY ".next"
    //which causes flow to bypass route handler code and jump back to app.js
    handleValidationErrors
];


// Both Helper functions not working?!
const getAvgRating = (reviews) => {
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return reviews.length ? (totalStars / reviews.length).toFixed(avgStarPrecision) : 0;
};

const getPreviewImage = (images) => {
    const previewImage = images.find(image => image.preview);
    return previewImage ? previewImage.url : "No Preview Image Available";
};


router.get('/', async (req, res, next) => {
    try {

        const spots = await Spot.findAll({
            include: [
                { model: SpotImage },
                { model: Review }
            ]
        });

        const result = spots.map(spot => {

            // // Preview Image
            let previewImage = spot.SpotImages.find(image => image.preview);
            previewImage = previewImage ? previewImage : { url: "No Preview Image Available" }

            // Average Stars
            const totalStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
            const avgRating = spot.Reviews.length ? totalStars / spot.Reviews.length : 0;


            // Create new spot object
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
                avgRating: avgRating.toFixed(avgStarPrecision),
                previewImage: previewImage.url,
            }
        });
        res.json({ Spots: result })
    } catch (e) {
        next(e)
    }
});

//Get all Spots by current user
router.get('/current', async (req, res, next) => {
    // router.get('/current', requireAuth, async (req, res, next) => {
    try {
        // const { user } = req.body
        const { user } = req;

        const spots = await Spot.findAll({
            include: [
                { model: SpotImage },
                { model: Review }
            ],
            where: {
                ownerId: user.id
            }
        });

        const result = spots.map(spot => {

            // Preview Image
            let previewImage = spot.SpotImages.find(image => image.preview);
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
                avgRating: avgRating.toFixed(avgStarPrecision),
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
            avgStarRating: avgRating.toFixed(avgStarPrecision),
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
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

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

//Add Image to Spot

// router.post('/:spotId/images', async (req, res, next) => {
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        // const { user } = req.body
        const { user } = req;
        let { spotId } = req.params;
        let { url, preview } = req.body;

        const currentSpot = await Spot.findByPk(spotId);

        if (!currentSpot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }

        if (parseInt(user.id) !== parseInt(currentSpot.ownerId)) {
            return res.status(403).json({ message: "Forbidden" })
        }


        //if preview is invalid, set to false
        preview = preview === "true" ? true : false
        spotId = parseInt(spotId)

        const currentSpotImage = await SpotImage.create({
            url,
            preview,
            spotId
        })

        res.json({
            id: currentSpot.id,
            url,
            preview
        })

    } catch (e) {
        next(e)
    }
})

//Delete Spot
// router.delete('/:spotId', async (req, res, next) => {
router.delete('/:spotId', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        // const userId = req.bodyr.id;

        const { spotId } = req.params;
        const currentSpot = await Spot.findByPk(spotId);

        if (!currentSpot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            });
        }


        if (userId !== currentSpot.ownerId) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        currentSpot.destroy();
        res.json({ "message": "Successfully deleted" })
    } catch (e) {
        next(e)
    }
})

router.put('/:spotId', async (req, res, next) => {
    //  router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {  
    try {
        const { spotId } = req.params;

        const userId = req.user.id;
        // const userId = req.body.id;

        const { address, city, state, country } = req.body;
        const { lat, lng, name, description, price } = req.body;

        const currentSpot = await Spot.findByPk(spotId);
        if (!currentSpot) {
            res.status(404).json({ message: "Spot couldn't be found" });
        }

        const { ownerId } = currentSpot;

        if (parseInt(userId) !== parseInt(ownerId)) {
            return res.status(403).json({ message: "Forbidden" })
        }

        await currentSpot.update(
            {
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
        res.json(currentSpot)
    } catch (e) {
        next(e)
    }
})



module.exports = router;