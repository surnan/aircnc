'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = "Spots"
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([ 
      {
        ownerId: 1,
        address: "One Park Avenue",
        city: "New York City",
        state: "NY",
        country: "USA",
        lat: 40.746052095477836,
        lng: -73.98142495133493,
        name: "NYU Langone Headquarters",
        description: "Sleep, get healed, get paid !!",
        price: 3000,
      },
      {
        ownerId: 1,
        address: "78 Cottage Street",
        city: "Jersey City",
        state: "NJ",
        country: "USA",
        lat: 40.73546808655058,
        lng: -74.0622927904529,
        name: "Peachtree Suites",
        description: "Sleep, recharge, privacy & high quality & cheap price",
        price: 1000,
      },
      {
        ownerId: 2,
        address: "1072 Elder Ave",
        city: "Bronx",
        state: "NY",
        country: "USA",
        lat: 40.82595300239568,
        lng: -73.87838826939743,
        name: "Highway Inn",
        description: "Where Hip Hop as born",
        price: 75,
      },
      {
        ownerId: 2,
        address: "12 Union Street",
        city: "New York City",
        state: "NY",
        country: "USA",
        lat: 40.746052095477836,
        lng: -73.98142495133493,
        name: "Union Square Hotel",
        description: "Enjoy the Park",
        price: 500,
      },
      {
        ownerId: 3,
        address: "22 Coney Island Avenue",
        city: "Brooklyn",
        state: "NY",
        country: "USA",
        lat: 40.73546808655058,
        lng: -74.0622927904529,
        name: "Roller Coaster Hotel",
        description: "Enoy amusement parks",
        price: 80
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['NYU Langone Headquarters', 'Peachtree Suites', 'Boogy Down Bronx'] }
    },{});
  }
};
