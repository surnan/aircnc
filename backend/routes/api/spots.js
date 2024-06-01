// backend/routes/api/spots.js

const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');

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
    handleValidationErrors
];


const validateReview = [
    check('review').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Review text is required'),
    check('stars').exists({ checkFalsy: true }).isFloat({ min: 1.0, max: 5.0 }).withMessage('Stars must be from 1 to 5'),
    handleValidationErrors
];

//validator for the spots search query.
const queryParams = [
    check('page', 'isInt({ min: 1 })', 'Page must be greater than or equal to 1'),
    check('size', 'isInt({ min: 1 })', 'Size must be greater than or equal to 1'),
    check('maxLat', 'isFloat({ max: 90.0000000 })', 'Maximum latitude is invalid'),
    check('minLat', 'isFloat({ min: -90.0000000 })', 'Minimum latitude is invalid'),
    check('maxLng', 'isFloat({ max: 180.0000000 })', 'Maximum longitude is invalid'),
    check('minLng', 'isFloat({ min: -180.0000000 })', 'Minimum longitude is invalid'),
    check('minPrice', 'isCurrency({ min: 1.00 })', 'Minimum price must be greater than or equal to 0'),
    check('maxPrice', 'isCurrency({ min: 1.00 })', 'Maximum price must be greater than or equal to 0'),
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

// function formatDate(dateString) {
//     const date = new Date(dateString);

//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//     }).replace(',', '');
//   }

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.get('/', queryParams, async (req, res, next) => {
    try {

        const spots = await Spot.findAll({
            include: [
                { model: SpotImage },
                { model: Review }
            ]
        });

        const spotsMap = spots.map(spot => {
            const spotJson = spot.toJSON();

            const { SpotImages, Reviews, ...res } = spotJson;
            const foundPreviewImage = SpotImages.find(e => e.preview)
            const avgRating = Reviews.reduce((sum, review) => sum += review.stars, 0) / Reviews.length;
            const fixedRating = isNaN(avgRating) ? "n/a" : avgRating.toFixed(1);

            res.lat = res.lat.toFixed(6)
            res.lng = res.lng.toFixed(6)
            res.avgRating = Number(fixedRating);
            res.createdAt = formatDate(res.createdAt)
            res.updatedAt = formatDate(res.updatedAt)
            res.previewImage = foundPreviewImage ? foundPreviewImage.url : null
            return res;
        });

        res.json({ Spots: spotsMap })
    } catch (e) {
        next(e)
    }
});

//Get all Spots by current user
// get all spots owned by the logged in user
router.get('/current', requireAuth, async (req, res, next) => {

    try {

        const { user } = req;

        if (user) {
            const spots = await Spot.findAll({
                include: [
                    { model: SpotImage },
                    { model: Review }
                ],
                where: {
                    ownerId: user.id
                }
            });

            const spotsMap = spots.map(spot => {
                const spotJson = spot.toJSON();

                const { SpotImages, Reviews, ...res } = spotJson;
                const foundPreviewImage = SpotImages.find(e => e.preview)
                const avgRating = Reviews.reduce((sum, review) => sum += review.stars, 0) / Reviews.length;
                const fixedRating = isNaN(avgRating) ? "n/a" : avgRating.toFixed(1);

                res.lat = res.lat.toFixed(6)
                res.lng = res.lng.toFixed(6)
                res.avgRating = Number(fixedRating);
                res.createdAt = formatDate(res.createdAt)
                res.updatedAt = formatDate(res.updatedAt)
                res.previewImage = foundPreviewImage ? foundPreviewImage.url : null
                return res;
            });

            res.json({ Spots: spotsMap })

        }

    } catch (e) {
        next(e)
    }
});


//Get details of a Spot from an Id
router.get('/:spotId', async (req, response, next) => {
    try {
        const spotId = parseInt(req.params.spotId)

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

        if (!currentSpot) {
            const err = new Error;
            err.message = "Spot couldn't be found"
            err.status = 404;
            return next(err)
        }

        const currentSpotJson = currentSpot.toJSON()
        const { Reviews, SpotImages, Owner, ...res } = currentSpotJson;

        const sum = Reviews.reduce((sum, e) => sum += Number(e.stars), 0)
        const length = Reviews.length;

        res.numReviews = length
        res.avgStarRating = length ? (sum / length).toFixed(1) : 0;
        res.avgStarRating = Number(res.avgStarRating)
        res.lat = res.lat.toFixed(6)
        res.lng = res.lng.toFixed(6)
        res.createdAt = formatDate(res.createdAt)
        res.updatedAt = formatDate(res.updatedAt)
        response.json({ ...res, SpotImages, Owner })
    } catch (e) {
        next(e)
    }
})

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

    try {
        const { user } = req;
        user.id = parseInt(req.user.id)

        let {lat, lng, price}= req.body;
        const {city, state, description, address, name, country } = req.body;

        lat = parseFloat(lat.toFixed(6))
        lng = parseFloat(lng.toFixed(6))
        price = parseFloat(price)

        if (user) {
            const newSpot = await Spot.create(
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

            let newSpotJson = newSpot.toJSON();
            let responseBody = {...newSpotJson};
            responseBody.lat = lat
            responseBody.lng = lng
            responseBody.createdAt = formatDate(newSpotJson.createdAt)
            responseBody.updatedAt = formatDate(newSpotJson.updatedAt)
            responseBody.id = newSpotJson.id;
            return res.status(201).json(responseBody)
        }
    } catch (e) {
        next(e)
    }
})

//Add Image to Spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        const { user } = req;
        let { url, preview } = req.body;
        const spotId = Number(req.params.spotId)

        const currentSpot = await Spot.findByPk(spotId);

        if (!currentSpot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }

        if (parseInt(user.id) !== parseInt(currentSpot.ownerId)) {
            return res.status(403).json({ message: "Forbidden" })
        }

        preview = preview === "true" ? true : false

        const currentSpotImage = await SpotImage.create({
            url,
            preview,
            spotId
        })

        res.status(201).json({
            id: Number(currentSpotImage.id),
            url,
            preview
        })
    } catch (e) {
        next(e)
    }
})

//Delete Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

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

//Edit Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, response, next) => {
    // res.json("hello")
    try {
        const spotId = parseInt(req.params.spotId);
        const { user } = req;
        const userId = parseInt(req.user.id)

        let {lat, lng, price}= req.body;
        const {city, state, description, address, name, country } = req.body;

        lat = parseFloat(lat.toFixed(6))
        lng = parseFloat(lng.toFixed(6))
        price = parseFloat(price.toFixed(2))



        const currentSpot = await Spot.findByPk(spotId);
        if (!currentSpot) {
            response.status(404).json({ message: "Spot couldn't be found" });
        }

        const ownerId = parseInt(currentSpot.ownerId);

        
        if (userId !== ownerId) {
            return response.status(403).json({ 
                message: "Forbidden"
            })
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

        let res = currentSpot.toJSON();
        res.createdAt = formatDate(res.createdAt)
        res.updatedAt = formatDate(res.updatedAt)
        response.json(res)
    } catch (e) {
        next(e)
    }
})

//Create a Review for a Spot based on the Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" })
    }
    const reviews = await Review.findAll(
        {
            where: { spotId: spotId },
            include:
                [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ],
        });

    res.json({ Reviews: reviews });
});


//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" });
    }

    const userId = req.user.id;

    const usersReview = await Review.findOne({ where: { userId: userId, spotId: spotId } });

    if (usersReview) {
        res.status(500).json({ message: "User already has a review for this spot" });
    }

    const spot_review = await Review.create(
        {
            userId,
            spotId,
            review,
            stars: stars
        }
    );

    const spot_reviewJson = spot_review.toJSON()
    spot_reviewJson.createdAt = formatDate(spot_reviewJson.createdAt)
    spot_reviewJson.updatedAt = formatDate(spot_reviewJson.updatedAt)

    res.status(201).json(spot_reviewJson);
});

module.exports = router;
