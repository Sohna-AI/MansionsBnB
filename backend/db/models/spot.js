'use strict';
const { Model } = require('sequelize');
const {
  validCountries,
  validStatesInAmerica,
  validStatesInCanada,
  validStatesInMexico,
  validStatesInUk,
} = require('../../utils/validatePlaces');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
      });

      Spot.hasMany(models.spotImage, {
        foreignKey: 'spotId',
        as: 'previewImage',
      });

      Spot.hasMany(models.spotImage, {
        foreignKey: 'spotId',
        as: 'spotImages',
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          notEmpty: true,
          len: [2, 30],
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          len: [2, 15],
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          len: [2, 3],
          matchState(value) {
            if (this.country === 'United States' && this.state.length > 2) {
              if (!validStatesInAmerica.includes(value)) {
                throw new Error('Must be a valid state in United States');
              }
            } else if (this.country === 'United Kingdom') {
              if (!validStatesInUk.includes(value)) {
                throw new Error('Must be a valid state in United Kingdom');
              }
            } else if (this.country === 'Canada' && this.state.length > 2) {
              if (!validStatesInCanada.includes(value)) {
                throw new Error('Must be a valid state in Canada');
              }
            } else if (this.country === 'Mexico' && this.state.length > 2) {
              if (!validStatesInMexico.includes(value)) {
                throw new Error('Must be a valid state in Mexico');
              }
            }
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          len: [2, 30],
          isIn: [validCountries],
        },
      },
      lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          isDecimal: true,
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          isDecimal: true,
          min: -180.0,
          max: 180.0,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          notNull: true,
          len: [3, 30],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          len: [0, 500],
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          notNull: true,
          min: 50,
        },
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};
