// backend/routes/api/spot-images.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');
const { Model } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const spotImage = await SpotImage.findByPk(imageId);
        if (!spotImage) {
            res.status(404).json({
                message: "Spot image couldn't be found"
            });
        }

        await spotImage.destroy();
        return res.json({ message: 'Deleted successfully!' });
    } catch (e) {
        next(e)
    }
});




module.exports = router;