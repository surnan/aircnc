'use strict';

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

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
        url: 'www.google1.com'
      },
      {
        reviewId: 2,
        url: 'www.google2.com'
      },
      {
        reviewId: 3,
        url: 'www.google3.com'
      },
      {
        reviewId: 1,
        url: 'www.google4.com'
      },
      {
        reviewId: 2,
        url: 'www.google5.com'
      },
      {
        reviewId: 3,
        url: 'www.google6.com'
      },
      {
        reviewId: 1,
        url: 'www.google7.com'
      },
      {
        reviewId: 2,
        url: 'www.google8.com'
      },
      {
        reviewId: 3,
        url: 'www.google9.com'
      }

    ],{ validate: true });
  },
  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};