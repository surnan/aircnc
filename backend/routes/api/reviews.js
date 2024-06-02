// backend/routes/api/reviews.js

const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, restoreUser, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');


const validateReview = [
    check('review').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Review text is required'),
    check('stars').exists({ checkFalsy: true }).isFloat({ min: 1.0, max: 5.0 }).withMessage('Stars must be from 1 to 5'),
    handleValidationErrors
];

const validateSpot = [
    check('address').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).isString().notEmpty().withMessage('City is required'),
    check('state').exists({ checkFalsy: true }).isString().notEmpty().withMessage('State is required'),
    check('country').exists({ checkFalsy: true }).isString().notEmpty().withMessage('Country is required.'),
    check('lat').exists({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage('Latitude is not valid'),
    check('lng').exists({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage('Longitude is not valid'),
    check('name').exists({ checkFalsy: true }).isString().isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true }).notEmpty().withMessage('Description is required'),
    check('price').exists({ checkFalsy: true }).isFloat({ min: 0, max: 2000 }).withMessage('Price per day is required'),
    handleValidationErrors
];


//!!!NEEDS PREVIEW IMAGE !!!!
//Get current user reviews
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const { user } = req
        const userId = user.id;
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
                    userId: userId
                }
            }
        )

        for (let review of reviews) {
            let spot = await Spot.findByPk(review.spotId);
            if (!spot) continue
            let previewImage = spot.SpotImages.find(image => image.preview);
            previewImage = previewImage ? previewImage : { url: "No Preview Image Available" }
            review.Spot = { ...review.Spot, "hello": "world" }
        }
        res.json({ Review: reviews })
    } catch (e) {
        next(e)
    }
})

//Create a Review for a Spot based on the Spot's Id
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { user } = req;
    const { lat, lng, address, name, country, city, state, description, price } = req.body
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


//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const review = await Review.findByPk(reviewId);
        const { user } = req.user;

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" })
        }

        if (user) {
            const userId = parseInt(user.id)

            if (userId !== review.userId) { //verify review belongs to user
                return res.status(403).json({ message: "Forbidden" })
            }

            const images = await review.getReviewImages();

            if (images.length > 10) {
                return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
            }


            const reviewImage = await ReviewImage.create(
                {
                    url: req.body.url,
                    reviewId
                }
            );

            res.status(201).json({
                "id": reviewImage.id,
                "url": reviewImage.url
            });
        } else {
            const err = new Error;
            err.message = "Review couldn't be found"
            err.status = 404;
            throw err;
        }
    } catch (e) {
        next(e)
    }
});


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const currentReview = await Review.findByPk(reviewId)
        if (!currentReview) {
            return res.status(404).json({ message: "Review couldn't be found" })
        }

        const { user } = req
        const userId = user.id;

        const { review, stars } = req.body

        if (userId !== currentReview.userId) {
            return res.status(403).json({ message: "Forbidden" })
        }

        await currentReview.update(
            {
                userId,
                spotId: currentReview.spotId,
                review,
                stars
            }
        );
        res.json(currentReview);
    } catch (e) {
        next(e)
    }
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const userId = parseInt(req.user.id);

        const reviewId = parseInt(req.params.reviewId);
        const currentReview = await Review.findByPk(reviewId);

        if (!currentReview) {
            res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        if (userId !== currentReview.userId) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        currentReview.destroy();
        res.json({ "message": "Successfully deleted" })

    } catch (e) {
        next(e)
    }
})

module.exports = router;