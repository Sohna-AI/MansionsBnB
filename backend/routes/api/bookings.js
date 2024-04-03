const express = require('express');
const router = express.Router();
const { Booking, Spot, spotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

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
  if (!bookings) {
    return res.status(404).json({
      message: 'No bookings were found for current user',
    });
  }
  res.status(200).json(bookings);
});

router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(bookingId);
  const spotId = booking.spotId;
  const currDate = new Date();
  const parseStart = new Date(startDate);
  const parseEnd = new Date(endDate);

  const existingBookings = await Booking.findOne({
    where: {
      spotId: spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.lt]: parseEnd,
          },
          endDate: {
            [Op.gt]: parseStart,
          },
        },
      ],
    },
  });
  if (req.user.id !== booking.userId) {
    return res.status(403).json({
      error: 'Authorization required: Booking can only edited by ',
    });
  } else if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found.",
    });
  } else if (currDate > parseEnd) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  } else if (startDate && parseStart < currDate) {
    return res.status(400).json({
      message: "Start date can't be in the past",
    });
  } else if (endDate && parseEnd <= parseStart) {
    return res.status(400).json({
      message: "End date can't be on or before startDate",
    });
  } else if (existingBookings.startDate) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
      },
    });
  } else if (existingBookings.endDate) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        endDate: 'End Date conflicts with an existing booking',
      },
    });
  } else {
    booking.startDate = parseStart;
    booking.endDate = parseEnd;
    await booking.save();
  }
  res.status(200).json(booking);
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }
  const currDate = new Date();
  const parseStart = new Date(booking.startDate);
  const parseEnd = new Date(booking.endDate);

  const spot = await Spot.findByPk(booking.spotId);
  const isBookingOwner = spot.ownerId === userId;
  const isSpotOwner = booking.userId === userId;
  if (currDate >= parseStart && currDate <= parseEnd) {
    return res.status(400).json({
      message: "Bookings that have been started can't be deleted",
    });
  } else if (currDate >= parseEnd) {
    return res.status(400).json({
      message: "Bookings in the past can't be deleted",
    });
  } else if (!isBookingOwner && !isSpotOwner) {
    return res.status(403).json({
      message: 'Authorization required: Not an Owner of the spot or the User on the Booking',
    });
  }
  await booking.destroy();
  res.status(200).json({
    message: 'Successful deletion',
  });
});
module.exports = router;
