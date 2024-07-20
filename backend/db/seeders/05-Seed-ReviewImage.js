'use strict';

const { ReviewImage } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "ReviewImages"
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: '/assets/images/houseImages/11.jpg',
      },
      {
        reviewId: 2,
        url: '/assets/images/houseImages/12.jpg',
      },
      {
        reviewId: 3,
        url: '/assets/images/houseImages/13.jpeg',
      },
      {
        reviewId: 4,
        url: '/assets/images/houseImages/14.jpeg',
      },
      {
        reviewId: 5,
        url: '/assets/images/houseImages/15.jpeg',
      },
      {
        reviewId: 6,
        url: '/assets/images/houseImages/16.jpeg',
      },
      {
        reviewId: 1,
        url: '/assets/images/houseImages/17.jpeg',
      },
      {
        reviewId: 2,
        url: '/assets/images/houseImages/18.jpeg',
      },
      {
        reviewId: 3,
        url: '/assets/images/houseImages/19.jpeg',
      }

    ],{ validate: true });
  },
  async down(queryInterface, Sequelize) {
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   reviewId: { [Op.in]: [1, 2, 3] }
    // }, {});
    return queryInterface.bulkDelete(options, {}, {});
  }
};