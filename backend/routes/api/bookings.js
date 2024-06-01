// backend/routes/api/spot-images.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');
const { Model } = require('sequelize');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { append } = require('vary');


var today = new Date();
const validateBooking = [
    check('startDate').exists({ checkFalsy: true }).isBefore(today).withMessage('startDate cannot be in the past.'),
    check('endDate').exists({ checkFalsy: true })
        .custom((endDate, { req }) => {
            const startDate = req.body.startDate;
            if (endDate <= startDate) {
                throw new Error("End before Start")
            }
        }),
    handleValidationErrors
];

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date



// delete a existing booking by id
// delete an existing review
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        
        const { user } = req;
        const currentBooking = await Booking.findByPk(bookingId);

        if (!currentBooking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            });
        };

        if (currentBooking.userId !== user.id) {
            return res.status(403).json({
                message: "Forbidden"
            })
        };
        const deletedbooking = await currentBooking.destroy();
        res.json({ message: 'Successfully deleted' });
    } catch (error) {
        next(error);
    };
});

//NEEDS PREVIEW IMAGE ON BOOKINGS.SPOT
// router.get('/current', requireAuth, async (req, res, next) => {
router.get('/current', async (req, res, next) => {
    try {
        const { user } = req;
        const userId = user.id

        const allBookings = await Booking.findAll({
            include: [
                {
                    model: Spot,
                },            
            ],
            where: {
                userId
            }
        })
        res.json({ "Bookings": allBookings });
    } catch (e) {
    next(e)
}
});

//Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        res.status(404).json({
            message: "Booking couldn't be found"
        });
    }

    const userId = req.user.id;
    if (userId !== booking.userId) {
        return res.status(403).json({ message: "Forbidden" })
    }

    const { spotId, startDate, endDate } = req.body;

    await booking.update(
        {
            userId: req.body.userId,
            spotId,
            startDate,
            endDate
        }
    );
    res.json(booking);
});


router.put('/:bookingId', requireAuth, validateBooking, async(req, res, next) =>{
    const {bookingId} = req.params;
    const booking = await Booking.findByPk(bookingId);
    if(!booking){
      res.status(404).json({
       message: "Booking couldn't be found"
     });
    }

    const userId = req.user.id;
    if(userId !== booking.userId){
      return res.status(403).json({message: "Forbidden"})
   }

  
   const reqStartDate = Date.parse(req.body.startDate); 
   const reqEndDate = Date.parse(req.body.endDate);

    let {startDate, endDate} = booking;
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);

    await booking.update(
      { 
       userId: req.body.userId, 
       spotId: req.body.spotId,
       startDate: req.body.startDate,
       endDate: req.body.endDate
      }
  );

  
  res.json(booking);
});


module.exports = router;