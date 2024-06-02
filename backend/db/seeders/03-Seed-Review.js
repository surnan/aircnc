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
        review: "abc",
        stars: 3//r1
      },
      {
        userId: 1,
        spotId: 4,
        review: "def",
        stars: 5///r2
      },
      {
        userId: 2,
        spotId: 2,
        review: "ghi",
        stars: 4//r3
      },
      {
        userId: 2,
        spotId: 1,
        review: "jkl",
        stars: 5//r4
      },
      {
        userId: 3,
        spotId: 4,
        review: "mno",
        stars: 3//r5
      },
      {
        userId: 4,
        spotId: 4,
        review: "pqr",
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
