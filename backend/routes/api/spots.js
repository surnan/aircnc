// backend/routes/api/spots.js

const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Op } = require('sequelize')
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');

// const avgStarPrecision = 1;

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

const validateBooking = [
    check('startDate').exists({ checkFalsy: true }).withMessage('Start date is required'),
    check('endDate').exists({ checkFalsy: true }).withMessage('End date is required'),
    handleValidationErrors
];

const validateReview = [
    check('review').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Review text is required'),
    check('stars').exists({ checkFalsy: true }).isFloat({ min: 1.0, max: 5.0 }).withMessage('Stars must be from 1 to 5'),
    handleValidationErrors
];


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

function formatDateNoTime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

//validator for the spots search query.
const validateQueryParameters = [
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
    check('size').optional().isInt({ min: 1 }).withMessage('Size must be greater than or equal to 1'),
    check('minLat').optional().isFloat({ min: -1000 }).withMessage("Minimum latitude is invalid"),
    check('maxLat').optional().isFloat({ max: 100 }).withMessage("Maximum latitude is invalid"),
    check('minLng').optional().isFloat({ min: -1000 }).withMessage("Minimum longitude is invalid"),
    check('maxLng').optional().isFloat({ max: 100 }).withMessage("Maximum longitude is invalid"),
    check('minPrice').optional().isInt({ min: 0 }).withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice').optional().isInt({ min: 0 }).withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
];


router.get('/', validateQueryParameters, async (req, res, next) => {
    try {

        let where = {};

        let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice = 0, maxPrice } = req.query;

        const sizePageShow = (Object.entries(req.query).length === 0)
            ? false
            : true

        page = parseInt(page);
        size = parseInt(size);

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price[Op.gte] = Number(minPrice);
            if (maxPrice !== undefined) where.price[Op.lte] = Number(maxPrice);
        }

        if (minLat !== undefined || maxLat !== undefined) {
            where.lat = {};
            if (minLat !== undefined) where.lat[Op.gte] = Number(minLat);
            if (maxLat !== undefined) where.lat[Op.lte] = Number(maxLat);
        }

        if (minLng !== undefined || maxLng !== undefined) {
            where.lng = {};
            if (minLng !== undefined) where.lng[Op.gte] = Number(minLng);
            if (maxLng !== undefined) where.lng[Op.lte] = Number(maxLng);
        }

        const spots = await Spot.findAll({
            include: [
                { model: SpotImage },
                { model: Review }
            ],
            where,
            limit: size,
            offset: parseInt((page - 1)) * size
        });



        // const spotsMap = spots.map(spot => {
        //     const spotJson = spot.toJSON();

        //     const { SpotImages, Reviews, ...res } = spotJson;
        //     const foundPreviewImage = SpotImages.find(e => e.preview)
        //     const avgRating = Reviews.reduce((sum, review) => sum += review.stars, 0) / Reviews.length;
        //     const fixedRating = isNaN(avgRating) ? "n/a" : Number(avgRating.toFixed(1));

        //     res.lat = Number(res.lat.toFixed(7))
        //     res.lng = Number(res.lng.toFixed(7))

        //     res.avgRating = fixedRating

        //     res.createdAt = formatDate(res.createdAt)
        //     res.updatedAt = formatDate(res.updatedAt)

        //     if (foundPreviewImage) {
        //         res.previewImage = foundPreviewImage.url
        //     }

        //     return res;
        // });

        const spotsMap = spots.map(spot => {
            const spotJson = spot.toJSON();

            const { SpotImages, Reviews, ...res } = spotJson;
            const foundPreviewImage = SpotImages.find(e => e.preview)

            if (Reviews.length > 0) {
                const avgRating = Reviews.reduce((sum, review) => sum += review.stars, 0) / Reviews.length;
                res.avgRating = Number(avgRating.toFixed(1));
            }

            res.lat = Number(res.lat.toFixed(7))
            res.lng = Number(res.lng.toFixed(7))

            res.createdAt = formatDate(res.createdAt)
            res.updatedAt = formatDate(res.updatedAt)

            if (foundPreviewImage) {
                res.previewImage = foundPreviewImage.url
            }

            return res;
        });

        if (sizePageShow) {
            res.status(200).json({
                Spots: spotsMap,
                page,
                size
            })
        } else {
            res.status(200).json({
                Spots: spotsMap
            })
        }
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

                res.lat = Number(res.lat.toFixed(7))
                res.lng = Number(res.lng.toFixed(7))
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
        res.lat = Number(res.lat.toFixed(7))
        res.lng = Number(res.lng.toFixed(7))
        res.createdAt = formatDate(res.createdAt)
        res.updatedAt = formatDate(res.updatedAt)
        response.status(200).json({ ...res, SpotImages, Owner })
    } catch (e) {
        next(e)
    }
})

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

    try {
        const { user } = req;
        user.id = parseInt(req.user.id)

        let { lat, lng, price } = req.body;
        const { city, state, description, address, name, country } = req.body;

        lat = parseFloat(lat.toFixed(7))
        lng = parseFloat(lng.toFixed(7))
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

            // function formatDate(dateString) {
            // function formatDateNoTime(dateString) {

            let newSpotJson = newSpot.toJSON();
            let responseBody = { ...newSpotJson };
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
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const userId = parseInt(req.user.id);

        const spotId = parseInt(req.params.spotId);
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

        let { lat, lng, price } = req.body;
        const { city, state, description, address, name, country } = req.body;

        lat = parseFloat(lat.toFixed(7))
        lng = parseFloat(lng.toFixed(7))
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
router.get('/:spotId/reviews', async (req, res, next) => {
    try {

    } catch (e) {
        return next(e)

    }
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
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    try {
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

    } catch (e) {
        return nexy(e)
    }

});

//Get all Bookings for a Spot based on Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, response, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const user = req.user;
        const userId = parseInt(req.user.id);

        const currentSpot = await Spot.findByPk(spotId)

        if (user) {
            if (!currentSpot) {
                const err = new Error;
                err.message = "Spot couldn't be found"
                err.status = 404
                return next(err)
            }

            let bookingsCurrentSpot = await Booking.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                where: { spotId }
            })

            if (bookingsCurrentSpot.length === 0) {
                return response.json({ Bookings: "None" })
            }

            if (userId === currentSpot.ownerId) {
                const bookingsCurrentSpotMap = bookingsCurrentSpot.map(booking => {
                    const bookingJson = booking.toJSON();
                    const { User, ...res } = bookingJson
                    res.createdAt = formatDate(Date(res.createdAt))
                    res.updatedAt = formatDate(res.updatedAt)
                    res.startDate = formatDateNoTime(Date(res.createdAt))
                    res.endDate = formatDateNoTime(res.updatedAt)
                    return ({ User, ...res })
                })
                return response.json({ Bookings: bookingsCurrentSpotMap })
            }

            if (userId !== currentSpot.ownerId) {
                const bookingsCurrentSpotMap = bookingsCurrentSpot.map(booking => {
                    const bookingJson = booking.toJSON();
                    const { User, ...res } = bookingJson
                    let answer = {};

                    answer.spotId = res.spotId
                    answer.startDate = formatDateNoTime(res.createdAt)
                    answer.endDate = formatDateNoTime(res.updatedAt)
                    return (answer)
                })
                return response.json({ Bookings: bookingsCurrentSpotMap })
            }
        }
    } catch (e) {
        next(e)
    }
})

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const { startDate, endDate } = req.body;
        const userId = parseInt(req.user.id); // Assuming you have user ID from the authenticated user

        const start = new Date(startDate);
        const end = new Date(endDate);

        const verifySpot = await Spot.findByPk(spotId)
        if (!verifySpot) {
            let err = new Error;
            err.message = "Spot couldn't be found"
            err.status = 404;
            return next(err)
        }

        // Check if end date is before or on the start date
        if (end <= start) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate"
                }
            });
        }

        // Check if the start and end dates don't clash with existing bookings
        const conflictingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    { startDate: { [Op.between]: [start, end] } },
                    { endDate: { [Op.between]: [start, end] } },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: start } },
                            { endDate: { [Op.gte]: end } }
                        ]
                    }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        }

        // Create new booking
        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate: start,
            endDate: end
        });

        res.status(201).json(newBooking);
    } catch (e) {
        next(e);
    }
});




module.exports = router;