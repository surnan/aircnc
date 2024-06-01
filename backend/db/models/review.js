//Reviews
'use strict';
const {Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'})
      Review.belongsTo(models.User, {foreignKey: 'userId'})
      Review.hasMany(models.ReviewImage, {foreignKey: 'reviewId'})
    }
  }
  Review.init({
    userId:{
       type: DataTypes.INTEGER,
       allowNull: false,
       references: { model: 'Users' },
       onDelete: "CASCADE"
    },
    spotId:{
       type: DataTypes.INTEGER,
       allowNull: false,
       references: { model: 'Spots' },
       onDelete: "CASCADE"
    },
    review:{
       type: DataTypes.STRING,
       allowNull: true,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};