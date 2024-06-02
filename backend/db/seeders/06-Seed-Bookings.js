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
        startDate: new Date('2023-06-04'),
        endDate: new Date('2023-06-06'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023-06-07'),
        endDate: new Date('2023-06-09'),
      },
      {
        spotId: 4,
        userId: 4,
        startDate: new Date('2023-06-10'),
        endDate: new Date('2023-06-12'),
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2024-07-13'),
        endDate: new Date('2024-07-15'),
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2024-07-16'),
        endDate: new Date('2024-07-18'),
      },
      {
        spotId: 4,
        userId: 3,
        startDate: new Date('2024-07-19'),
        endDate: new Date('2024-07-21'),
      },
      {
        spotId: 1,
        userId: 4,
        startDate: new Date('2024-09-22'),
        endDate: new Date('2024-09-24'),
      }
    ],{ validate: true });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {}, {});
  }
};