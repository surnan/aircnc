'use strict';


const { Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "Reviews"
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 3,
        review: "Comfortable and affordable",
        stars: 3//r1
      },
      {
        userId: 1,
        spotId: 4,
        review: "Quiet and peaceful",
        stars: 5///r2
      },
      {
        userId: 2,
        spotId: 2,
        review: "Lots of nearby businesses and friendy neighbors",
        stars: 4//r3
      },
      {
        userId: 2,
        spotId: 1,
        review: "Busy and loud outside but quiet and peaceful inside",
        stars: 5//r4
      },
      {
        userId: 3,
        spotId: 4,
        review: "Expensive but worth the price",
        stars: 3//r5
      },
      {
        userId: 4,
        spotId: 4,
        review: "Quality customer service and very clean",
        stars: 3//r6
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, 'Reviews', null, {});
    return queryInterface.bulkDelete(options, {}, {});
  }
};
