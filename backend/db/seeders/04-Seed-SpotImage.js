'use strict';

/** @type {import('sequelize-cli').Migration} */


const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "SpotImages"
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 2,
        url: 'www.google.com',
        isPreview: true
      },
      {
        spotId: 3,
        url: 'www.google.com',
        isPreview: true
      },
      {
        spotId: 4,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 5,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 1,
        url: 'www.google.com',
        isPreview: true
      },
      {
        spotId: 2,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 3,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 4,
        url: 'www.google.com',
        isPreview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
