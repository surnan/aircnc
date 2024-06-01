//Spot-Images
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {

    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' })
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Spots' },
      onDelete: "CASCADE"
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 250]
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};