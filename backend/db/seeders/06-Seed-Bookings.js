'use strict';

const { Booking } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "Bookings"
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-03'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-03'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-03'),
      },
      {
        spotId: 4,
        userId: 4,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-03'),
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-03'),
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-03'),
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-08-04'),
      },
      {
        spotId: 3,
        userId: 4,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-03'),
      },
      {
        spotId: 4,
        userId: 1,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-24'),
      },
    ],{ validate: true });
  },
  async down(queryInterface, Sequelize) {
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   userId: { [Op.in]: [1, 2, 3] }
    // }, {});
    return queryInterface.bulkDelete(options, {}, {});
  }
};