// backend/routes/api/review-images.js
const express = require('express')
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage} = require('../../db/models');




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
            if (userId !== currentReview.userId) {
                return res.status(403).json({
                    message: "Forbidden"
                })
            }

            await currentReviewImage.destroy();

            return res.json({
                "message": "Successfully deleted"
            })
        }
    } catch (e) {
        next(e)
    }
});

module.exports = router;