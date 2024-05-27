'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "SpotImages"
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        spotId: 1,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 2,
        url: 'www.google.com',
        isPreview: false
      },
      {
        spotId: 3,
        url: 'www.google.com',
        isPreview: true
      }
    ],{ validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [1,2,3] }
    }, {});
  }
};
