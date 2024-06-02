'use strict';


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
        preview: false
      },
      {
        spotId: 2,
        url: 'www.googleB.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.googleC.com',
        preview: true
      },
      {
        spotId: 4,
        url: 'www.googleD.com',
        preview: false
      },
      {
        spotId: 4,
        url: 'www.googleE.com',
        preview: false
      },
      {
        spotId: 1,
        url: 'www.googleF.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.googleG.com',
        preview: false
      },
      {
        spotId: 3,
        url: 'www.googleH.com',
        preview: false
      },
      {
        spotId: 4,
        url: 'www.googleI.com',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {}, {});
  }
};
