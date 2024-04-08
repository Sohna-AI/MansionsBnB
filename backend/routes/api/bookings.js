const express = require('express');
const router = express.Router();
const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

router.get('/current', requireAuth, async (req, res) => {
  const userIdParam = req.user.id;
  const userId = parseInt(userIdParam);
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
      },
    ],
  });
  const previewImageFind = await SpotImage.findOne({
    attributes: ['url'],
    where: {
      preview: true,
    },
    as: 'previewImage',
    required: false,
  });
  if (!bookings.length) {
    return res.status(404).json({
      title: "User's bookings",
      message: 'Bookings not found',
      errors: {
        message: 'User has no scheduled bookings',
      },
    });
  }
  const responseBooking = await Promise.all(
    bookings.map(async (booking) => {
      const spot = booking.Spot.toJSON();
      return {
        id: booking.id,
        spotId: spot.id,
        Spot: {
          id: spot.id,
          ownerId: spot.ownerId,
          address: spot.address,
          city: spot.city,
          state: spot.state,
          country: spot.country,
          lat: Number(spot.lat),
          lng: Number(spot.lng),
          name: spot.name,
          description: spot.description,
          price: Number(spot.price),
          avgRating: spot.avgRating,
          previewImage: previewImageFind.url,
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    })
  );
  res.status(200).json({ Bookings: responseBooking });
});

router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const bookingIdParam = req.params.bookingId;
  const bookingId = parseInt(bookingIdParam);
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({
      title: 'Booking editing failed',
      message: 'Booking not found',
      errors: {
        message: 'Requested booking does not exist',
      },
    });
  }

  const { startDate, endDate } = req.body;
  const spotId = booking.spotId;
  const currDate = new Date();
  const parseStartDate = new Date(startDate);
  const parseEndDate = new Date(endDate);
  const parseStart = startDate;
  const parseEnd = endDate;

  const existingBookings = await Booking.findOne({
    where: {
      spotId: spotId,
      [Op.not]: {
        id: bookingId,
      },
      startDate: {
        [Op.lte]: parseStart,
      },
      endDate: {
        [Op.gte]: parseEnd,
      },
    },
  });

  const existingConflicts = await Booking.findOne({
    where: {
      spotId: spotId,
      startDate: parseStart,
      endDate: parseEnd,
    },
  });

  const existingStartDate = await Booking.findOne({
    where: {
      spotId: spotId,
      startDate: parseStart,
    },
  });

  const existingEndDate = await Booking.findOne({
    where: {
      spotId: spotId,
      endDate: parseStart,
    },
  });

  const existingStartDateEnd = await Booking.findOne({
    where: {
      spotId: spotId,
      startDate: parseEnd,
    },
  });

  const existingEndDateEnd = await Booking.findOne({
    where: {
      spotId: spotId,
      endDate: parseEnd,
    },
  });

  const startEndProgress = await Booking.findOne({
    where: {
      spotId: spotId,
      [Op.not]: {
        id: bookingId,
      },
      [Op.or]: [
        {
          startDate: {
            [Op.lt]: parseEnd,
          },
          endDate: {
            [Op.gt]: parseStart,
          },
        },
        {
          startDate: {
            [Op.between]: [parseStart, parseEnd],
          },
        },
        {
          endDate: {
            [Op.between]: [parseStart, parseEnd],
          },
        },
      ],
    },
  });

  const existingSurroundBookings = await Booking.findOne({
    where: {
      spotId: spotId,
      [Op.not]: {
        id: bookingId,
      },
      startDate: {
        [Op.gt]: parseStart,
      },
      endDate: {
        [Op.lt]: parseEnd,
      },
    },
  });

  if (req.user.id !== booking.userId) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Authorization required',
      errors: {
        message: 'Booking can only edited by authorized User',
      },
    });
  } else if (startDate === endDate) {
    return res.status(400).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: "Start date can't be the same as end date",
        endDate: "End date can't be the same as start date",
      },
    });
  } else if (currDate > parseEnd) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date of the booking is in the past',
        endDate: 'End date of the booking is in the past',
      },
    });
  } else if (parseStartDate < currDate) {
    let errors = {};
    errors.startDate = "Start date can't be in the past";
    if (parseEndDate < currDate) {
      errors.endDate = "End date can't be in the past";
    }
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: errors,
    });
  } else if (parseEndDate <= parseStartDate) {
    return res.status(400).json({
      title: 'Booking editing failed',
      message: 'Booking Conflict',
      errors: {
        endDate: "End date can't be on or before start date",
      },
    });
  } else if (existingConflicts) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
    });
  } else if (existingBookings) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date within existing booking',
        endDate: 'End Date within existing booking',
      },
    });
  } else if (existingSurroundBookings) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date surrounds an existing booking',
        endDate: 'End Date surrounds an existing booking',
      },
    });
  } else if (existingStartDate) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking start date',
      },
    });
  } else if (existingEndDate) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking end date',
      },
    });
  } else if (existingStartDateEnd) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        endDate: 'End date conflicts with an existing booking start date',
      },
    });
  } else if (existingEndDateEnd) {
    return res.status(403).json({
      title: 'Booking editing failed',
      message: 'Booking conflict',
      errors: {
        endDate: 'End date conflicts with an existing booking end date',
      },
    });
  } else if (startEndProgress) {
    if (startEndProgress.startDate < parseStart) {
      return res.status(403).json({
        title: 'Booking editing failed',
        message: 'Booking conflict',
        errors: {
          startDate: "Start date can't be during an existing booking",
        },
      });
    }
    if (startEndProgress.endDate > parseStart) {
      return res.status(403).json({
        title: 'Booking editing failed',
        message: 'Booking conflict',
        errors: {
          endDate: "End date can't be during an existing booking",
        },
      });
    }
  } else {
    booking.startDate = parseStart;
    booking.endDate = parseEnd;
    await booking.save();
    res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });
  }
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingIdParam = req.params.bookingId;
  const bookingId = parseInt(bookingIdParam);
  const userId = req.user.id;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({
      title: 'Booking deletion failed',
      message: 'Booking not found',
      errors: {
        message: 'Requested booking does not exist',
      },
    });
  }
  const currDate = new Date();
  const parseStart = new Date(booking.startDate);
  const parseEnd = new Date(booking.endDate);

  const spot = await Spot.findByPk(booking.spotId);
  const isSpotOwner = spot.ownerId === userId;
  const isBookingOwner = booking.userId === userId;
  if (currDate >= parseStart && currDate <= parseEnd) {
    return res.status(400).json({
      title: 'Booking deletion failed',
      message: 'Booking has been started',
      errors: {
        message: "Started bookings can't be deleted",
      },
    });
  } else if (currDate >= parseEnd) {
    return res.status(400).json({
      title: 'Booking deletion failed',
      message: 'Booking has been completed',
      errors: {
        message: "Bookings in the past can't be deleted",
      },
    });
  } else if (!isBookingOwner && !isSpotOwner) {
    return res.status(403).json({
      title: 'Booking deletion failed',
      message: 'Authorization required',
      errors: {
        message: 'Not an owner of the spot or an authorized user on the booking',
      },
    });
  }
  await booking.destroy();
  res.status(200).json({
    message: 'Successful deletion',
  });
});
module.exports = router;
