'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "ReviewImages"
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        reviewId: 1,
        url: 'www.google.com'
      },
      {
        reviewId: 2,
        url: 'www.google.com'
      },
      {
        reviewId: 3,
        url: 'www.google.com'
      }
    ],{ validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3'] }
    }, {});
  }
};