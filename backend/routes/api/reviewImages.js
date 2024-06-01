// backend/routes/api/review-images.js
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');




router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const { user } = req;
        const userId = parseInt(req.user.id);
        const imageId = parseInt(req.params.reviewId);

        if (user) {
            const currentReviewImage = await ReviewImage.findByPk(imageId);

            if (!currentReviewImage) {
                return res.status(404).json({
                    message: "Review Image couldn't be found"
                });
            }

            const currentReview = await Review.findByPk(currentReviewImage.reviewId);

            // return res.json({
            //     userId,
            //     currentReview: currentReview
            // })

            if (userId !== currentReview.userId) {
                return res.status(403).json({
                    message: "Forbidden"
                })
            }

            await currentReviewImage.destroy();

            return res.json({
                "message": "Successfully deleted"
            })

            // await currentReviewImage.destroy();

            // return res.json({
            //     "message": "Successfully deleted"
            // })
        }
    } catch (e) {
        next(e)
    }
});




module.exports = router;