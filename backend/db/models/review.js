//Reviews
'use strict';
const {Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })

      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
      })


    }
  }
  Review.init({
    userId:{
       type: DataTypes.INTEGER,
       allowNull: false,
       references: { model: 'Users' }
    },
    spotId:{
       type: DataTypes.INTEGER,
       allowNull: false,
       references: { model: 'Spots' }
    },
    review:{
       type: DataTypes.STRING,
       allowNull: true
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};