//Review-Images
'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {

    static associate(models) {
      ReviewImage.belongsTo(models.Review, {foreignKey: 'reviewId'})
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Reviews' },
      onDelete: "CASCADE"
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};