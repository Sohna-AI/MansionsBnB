'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
      });

      User.hasMany(models.Review, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Booking, {
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 15],
          notNull: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 15],
          notNull: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(val) {
            if (Validator.isEmail(val)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
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
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['email', 'hashedPassword', 'updatedAt', 'createdAt'],
        },
      },
    }
  );
  return User;
};
