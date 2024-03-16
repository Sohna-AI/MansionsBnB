const express = require('express');
const router = express.Router();
const { User, Review, Spot, reviewImage, spotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  const reviews = await Review.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        where: {
          id: userId,
        },
      },
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: spotImage,
            attributes: ['url'],
            where: {
              preview: true,
            },
            as: 'previewImage',
          },
        ],
      },
      {
        model: reviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });
  res.status(200).json(reviews);
});


module.exports = router;
