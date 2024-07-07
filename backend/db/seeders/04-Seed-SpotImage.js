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
        url: 'frontend/assets/images/houseImages/1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'frontend/assets/images/houseImages/2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'frontend/assets/images/houseImages/3.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'frontend/assets/images/houseImages/4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'frontend/assets/images/houseImages/5.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '/assets/images/houseImages/6.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: '/assets/images/houseImages/7.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: '/assets/images/houseImages/8.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '/assets/images/houseImages/9.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: '/assets/images/houseImages/10.jpeg',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {}, {});
  }
};
