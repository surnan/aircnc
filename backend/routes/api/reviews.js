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


router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!!!');
});

const avgStarPrecision = 1;
const latlngPrecision = 6;


//!!!NEEDS PREVIEW IMAGE !!!!
//Get current user reviews
router.get('/current', async (req, res, next) => {
    // router.get('/', requireAuth, async (req, res, next) => {
    try {

        // const {user} = req
        const user = { id: 2 };
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
                    userId: safeUser.id
                }
            }
        )
        res.json({ Reviews: reviews })
    } catch (e) {
        next(e)
    }
})

//Create a Review for a Spot based on the Spot's Id
// router.post('/', requireAuth, validateSpot, async(req, res) => {
router.post('/', async (req, res) => {

    // const {user} = req;
    const user = { id: 1 };

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
// router.post('/:reviewId/images', async (req, res, next) => {
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    try {

        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId)

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" })
        }

        const user = { id: 2 }
        // const user = req.user

        const userId = user.id

        if (userId !== review.userId) { //verify review belongs to user
            return res.status(403).json({ message: "Forbidden" })
        }

        const images = await review.getReviewImages();
        console.log(images.length);

        if (images.length > 10) {
            res.status(403).json({ message: "Maximum number of images for this resource was reached" });
        }


        const reviewImage = await ReviewImage.create(
            {
                url: req.body.url,
                reviewId
            }
        );

        res.json({
            "id": reviewImage.id,
            "url": reviewImage.url
        });
    } catch (e) {
        next(e)
    }
});


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
// router.put('/:reviewId', async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const currentReview = await Review.findByPk(reviewId)
        if (!currentReview) {
            return res.status(404).json({ message: "Review couldn't be found" })
        }

        // const user = { id: 2 };
        const {user} = req

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
// router.delete('/:reviewId', requireAuth, async (req, res) => {
router.delete('/:reviewId', async (req, res) => {
    try {
        // const userId = req.user.id;
        const userId = 2;

        const { reviewId } = req.params;
        const currentReview = await Review.findByPk(reviewId);

        if (!currentReview) {
            res.status(404).json({
                message: "Review couldn't be found"
            });
        }


        if (userId !== currentReview.userId) {
            return res.status(403).json({
                message: "Forbidden",
                userId,
                reviewUserId:currentReview.userId
            })
        }

        currentReview.destroy();
        res.json({ "message": "Successfully deleted" })

    } catch (e) {
        next(e)
    }
})

module.exports = router;