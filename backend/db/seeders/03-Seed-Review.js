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
        spotId: 1,
        review: "abc",
        stars: 3
      },
      {
        userId: 1,
        spotId: 1,
        review: "def",
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: "ghi",
        stars: 4
      },
      {
        userId: 2,
        spotId: 2,
        review: "jkl",
        stars: 5
      },
      {
        userId: 3,
        spotId: 3,
        review: "mno",
        stars: 3
      },
      {
        userId: 3,
        spotId: 3,
        review: "pqr",
        stars: 3
      },
      {
        userId: 1,
        spotId: 1,
        review: "stu",
        stars: 3
      },
      {
        userId: 2,
        spotId: 2,
        review: "vwx",
        stars: 3
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, 'Reviews', null, {});
  }
};
