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

const validateBooking = [
    check('startDate').exists({ checkFalsy: true }).withMessage('Start date is required'),
    check('endDate').exists({ checkFalsy: true }).withMessage('End date is required'),
    handleValidationErrors
];

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


// delete a existing booking by id
// delete an existing review
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {

        const bookingId = parseInt(req.params.bookingId);
        const userId = parseInt(req.user.id);
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


        let today = new Date();


        if (currentBooking.startDate <= today) {
            console.log("A")
            const err = new Error
            err.message = "Bookings that have been started can't be deleted"
            err.status = 403
            return next(err)
        }

        console.log("B")

        const deletedbooking = await currentBooking.destroy();
        res.json({ message: 'Successfully deleted' });
    } catch (error) {
        next(error);
    };
});

//NEEDS PREVIEW IMAGE ON BOOKINGS.SPOT
// router.get('/current', requireAuth, async (req, res, next) => {
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const { user } = req;
        const userId = user.id

        const allBookings = await Booking.findAll({
            include: [
                {
                    model: Spot,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'description']
                    }
                },
            ],
            where: {
                userId
            },
            // attributes: {
            //     exclude: ['spotId', 'id']
            // }
        })

        let bookingsMap = await Promise.all(allBookings.map(async booking => {
            let bookingJson = booking.toJSON();

            const { Spot, ...stuff } = bookingJson
            stuff.startDate = formatDateNoTime(stuff.startDate)
            stuff.endDate = formatDateNoTime(stuff.endDate)
            stuff.createdAt = formatDate(stuff.startDate)
            stuff.updatedAt = formatDate(stuff.endDate)

            const foundPreviewImage = await SpotImage.findOne({
                where: {
                    preview: true,
                    spotId: Spot.id
                }
            })

            if (foundPreviewImage) {
                Spot.previewImage = foundPreviewImage.url
            }

            return {
                ...stuff,
                Spot: {
                    ...Spot,
                    lat: Number(Spot.lat.toFixed(7)),
                    lng: Number(Spot.lng.toFixed(7))
                }
            }
        }))
        res.status(200).json({ "Bookings": bookingsMap });
    } catch (e) {
        next(e)
    }
});


//Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const { startDate, endDate } = req.body;
        const userId = parseInt(req.user.id); // Assuming you have user ID from the authenticated user

        const start = new Date(startDate);
        const end = new Date(endDate);

        let currentBooking = await Booking.findByPk(bookingId)
        const spotId = parseInt(currentBooking.spotId)

        if (!currentBooking) {
            return res.status(404).json({ "message": "Booking couldn't be found" })
        }

        if (userId !== currentBooking.userId) {
            return res.status(403).json({ message: "Forbidden" })
        }

        // Check if end date is before or on the start date
        if (end <= start) {
            const err = new Error;
            err.status = 400
            err.message = "Bad Request"
            err.errors = { endDate: "endDate cannot come before startDate" }
            return next(err)
        };

        // Check if end date is before or on the start date
        let today = new Date();
        if (start <= today) {
            return res.status(403).json({ "message": "Past bookings can't be modified" })
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
        await currentBooking.update({
            bookingId,
            userId,
            startDate: start,
            endDate: end
        });

        res.status(201).json(currentBooking);
    } catch (e) {
        next(e);
    }
});

module.exports = router;