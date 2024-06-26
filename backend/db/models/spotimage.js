'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'previewImage',
      });

      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'spotImages',
      });
    }
  }
  SpotImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        get() {
          return this.getDataValue('createdAt').toISOString().replace('T', ' ').split('.')[0];
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        get() {
          return this.getDataValue('updatedAt').toISOString().replace('T', ' ').split('.')[0];
        },
      },
    },
    {
      sequelize,
      modelName: 'SpotImage',
    }
  );
  return SpotImage;
};
