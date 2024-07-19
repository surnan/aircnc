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
        url: 'https://www.home-mega.com/wp-content/uploads/2021/08/4416-Monticello-Ave-28-1-scaled.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://photos.zillowstatic.com/fp/828db8b15f2e8c98075e9448e6912b38-p_e.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/87b3605e6bd9499e38ec39ad6236f455-full.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://d1ja9tyo8nbkbc.cloudfront.net/45929683_S0440/S0440/S0440-R0100/ONEH6297093/ONEH6297093-2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://d1ja9tyo8nbkbc.cloudfront.net/45929683_S0440/S0440/S0440-R0100/ONE3561922/ONE3561922-2.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://www.compass.com/m/3aca145551c3be57f5147df19ebca2ed7074a8ca_img_0_12fd3/origin.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/24201bca71cee81a7d83cde64849ddaf-full.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://media.istockphoto.com/id/523513953/photo/times-square-in-new-york-city.jpg?s=612x612&w=0&k=20&c=ibPzzIPHrsIdPElVpZYHyWyvqIN4VXTzNP5UXiQcpu8=',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://bookaweb.s3.eu-central-1.amazonaws.com/media/31668/times-square.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://media.istockphoto.com/id/623595614/photo/new-york-city-skyline-statue-of-liberty.jpg?s=612x612&w=0&k=20&c=ivivsCJQlbb2bcWXT1uCCwlTFPLVl15DVfWYm_ZyK-I=',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {}, {});
  }
};
