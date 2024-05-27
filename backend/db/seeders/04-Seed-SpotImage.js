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
        url: 'www.googleA.com',
        isPreview: false
      },
      {
        spotId: 2,
        url: 'www.googleB.com',
        isPreview: true
      },
      {
        spotId: 3,
        url: 'www.googleC.com',
        isPreview: true
      },
      {
        spotId: 4,
        url: 'www.googleD.com',
        isPreview: false
      },
      {
        spotId: 5,
        url: 'www.googleE.com',
        isPreview: false
      },
      {
        spotId: 1,
        url: 'www.googleF.com',
        isPreview: true
      },
      {
        spotId: 2,
        url: 'www.googleG.com',
        isPreview: false
      },
      {
        spotId: 3,
        url: 'www.googleH.com',
        isPreview: false
      },
      {
        spotId: 4,
        url: 'www.googleI.com',
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
