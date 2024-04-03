'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
      });
    }
  }
  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
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
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
          notNull: true,
          notEmpty: true,
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
          notNull: true,
          isNumeric: true,
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
      modelName: 'Review',
    }
  );
  return Review;
};
