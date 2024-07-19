// backend/routes/api/spot-images.js
const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { Model } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const { user } = req;
        const userId = parseInt(req.user.id);
        const imageId = parseInt(req.params.imageId);

        if (user) {
            const currentSpotImage = await SpotImage.findByPk(imageId);

            if (!currentSpotImage) {
                return res.status(404).json({
                    message: "Spot Image couldn't be found"
                });
            }

            const currentSpot = await Spot.findByPk(currentSpotImage.spotId);

            if (userId !== currentSpot.ownerId) {
                return res.status(403).json({
                    message: "Forbidden"
                })
            }

            await currentSpotImage.destroy();

            return res.json({
                "message": "Successfully deleted"
            })
        }
    } catch (e) {
        next(e)
    }
});


router.delete('/spot/:spotId', requireAuth, async (req, res, next) => {
    try {
        const { user } = req;
        const userId = parseInt(req.user.id);
        const spotId = parseInt(req.params.spotId);
        if (user) {
            const allImages = await SpotImage.findAll({
                where: {
                    spotId
                }
            })

            for (let e of allImages){
                await e.destroy()
            }
            
            res.json({message: "hello world"})
        }
    } catch (e) {
        next(e)
    }
});


module.exports = router;