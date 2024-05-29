// backend/routes/api/review-images.js
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, setTokenCookie } = require('../../utils/auth');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');




// router.delete('/:reviewId', requireAuth, async (req, res) => {
    router.delete('/:imageId', async(req, res, next) =>{
        try {
            const {imageId} = req.params;
            const spotImage = await ReviewImage.findByPk(imageId);
            if(!spotImage){
               res.status(404).json({
                message: "Spot image couldn't be found"
              });
             }
            
            await spotImage.destroy();
             return res.json({ message: 'Deleted successfully!'});
        } catch (e) {
            next(e)
        }
     });




module.exports = router;