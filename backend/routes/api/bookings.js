const express = require('express');
const router = express.Router();
const { Booking, Spot, spotImage } = require('../../db/models');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const bookings = await Booking.findAll({
    where: {
      userId: userId,
    },
    include: [
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
    ],
  });

  res.status(200).json(bookings);
});

module.exports = router;
