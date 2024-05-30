// backend/routes/api/spot-images.js
const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User } = require('../../db/models');
const { Model } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


router.get('/', async(req, res, next)=>{
// router.get('/', requireAuth, async(req, res, next)=>{
    res.json("hello world")
})

router.get('/current', async(req, res, next)=>{
    // router.get('/', requireAuth, async(req, res, next)=>{
        res.json("hello world")
    })


module.exports = router;