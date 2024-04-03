'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
          isDate: true,
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
          isDate: true,
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
      modelName: 'Booking',
    }
  );
  return Booking;
};
