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
    check('startDate')
        .exists({ checkFalsy: true })
        .isBefore(today)
        .withMessage('startDate cannot be in the past.'),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((endDate, { req }) => {
            const startDate = req.body.startDate;
            if (endDate <= startDate) {
                throw new Error("endDate cannot be on or before startDate")
            }
        }),
    handleValidationErrors
];


//NEEDS PREVIEW IMAGE ON BOOKINGS.SPOT
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const userId = req.user.id;

    if (userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" })
    }

    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        }

        const usersBookings = await Booking.findAll({
            include: {
                model: Spot,
                where: {
                    ownerId: safeUser.id
                }
            },
        });
        res.json({ "Bookings": usersBookings });
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





module.exports = router;