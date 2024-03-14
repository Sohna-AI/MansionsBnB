'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      spotImage.belongsTo(models.Spot);
    }
  }
  spotImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        validate: {
          isBoolean(value) {
            if (typeof value !== 'boolean') {
              throw new Error('Can only be True or False');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'spotImage',
    }
  );
  return spotImage;
};
