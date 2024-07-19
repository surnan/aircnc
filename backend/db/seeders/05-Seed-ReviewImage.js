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
        url: 'https://travel.usnews.com/dims4/USNEWS/d59def3/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FCentral_Park_sunset_Wojtek_Zagorski_Getty.jpg',
      },
      {
        reviewId: 2,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 3,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 4,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 5,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 6,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 1,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 2,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
      },
      {
        reviewId: 3,
        url: 'https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_2240,c_limit/GettyImages-946087016.jpg',
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