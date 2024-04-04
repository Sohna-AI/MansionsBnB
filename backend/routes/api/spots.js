const express = require('express');
const router = express.Router();
const { User, Spot, Review, Booking, ReviewImage, spotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { calculateAverageRating, buildFilter } = require('../../utils/helpers');
const {
  validateBooking,
  validateReview,
  validateSpot,
  validateSpotImage,
  validateQueryParams,
} = require('../../utils/validation');
const { Op } = require('sequelize');

router.get('/', validateQueryParams, async (req, res) => {
  const { page = 1, size = 20 } = req.query;

  const pageNumber = parseInt(page);
  const pageSize = parseInt(size);
  const offset = (pageNumber - 1) * pageSize;
  const filter = buildFilter(req.query);
  const spots = await Spot.findAll({
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
    ],
    include: [
      {
        model: Review,
        attributes: ['stars'],
        required: false,
      },
      {
        model: spotImage,
        attributes: ['url'],
        where: { preview: true },
        as: 'previewImage',
        required: false,
      },
    ],
    group: ['Spot.id'],
    where: filter,
    limit: pageSize,
    offset: offset,
    order: [['id', 'ASC']],
  });

  for (const spot of spots) {
    const avgRating = await calculateAverageRating(spot.id);
    spot.setDataValue('avgRating', avgRating);
    spot.previewImage = spot.previewImage ? spot.previewImage.url : null;
  }

  const responseSpots = spots.map((spot) => {
    const { Reviews, ...spotData } = spot.toJSON();
    return {
      id: spotData.id,
      ownerId: spotData.ownerId,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: spotData.createdAt,
      updatedAt: spotData.updatedAt,

      avgRating: spotData.avgRating,
      previewImage: spotData.previewImage,
    };
  });

  return res.json({
    Spots: responseSpots,
    page: pageNumber,
    size: pageSize,
  });
});

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { id: ownerId } = req.user;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.status(201).json(newSpot);
});

router.post('/:spotId/images', requireAuth, validateSpotImage, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  if (!spot) {
    return res.status(404).json({ error: `Spot not found for id ${spotId}` });
  }

  if (req.user.id !== spot.ownerId) {
    return res.status(403).json({
      error: 'Unauthorized: Only owner can add an image',
    });
  }
  const newImage = await spotImage.create({
    spotId: spotId,
    url: url,
    preview: preview,
  });

  return res.status(201).json(newImage);
});

router.get('/current', requireAuth, async (req, res) => {
  const userIdParam = req.user.id;
  const userId = parseInt(userIdParam);

  const spot = await Spot.findAll({
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
      [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 1), 'avgRating'],
    ],
    where: {
      ownerId: userId,
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: spotImage,
        attributes: ['url'],
        where: {
          preview: true,
        },
        as: 'previewImage',
      },
    ],
    group: ['Spot.id', 'previewImage.id'],
  });
  if (!spot.length) {
    return res.status(200).json({
      message: 'User has no spots',
    });
  }
  return res.status(200).json({ Spots: spot });
});

router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId, {
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
      [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
      [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 1), 'avgStarRating'],
    ],
    include: [
      {
        model: Review,
        attributes: [],
        duplicating: false,
        required: false,
      },
      {
        model: spotImage,
        attributes: ['id', 'url', 'preview'],
        as: 'spotImages',
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        as: 'Owner',
      },
    ],
    group: ['Spot.id', 'spotImages.id', 'Owner.id'],
  });
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  return res.status(200).json(spot);
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  if (req.user.id !== spot.ownerId) {
    return res.status(403).json({
      error: 'Authorization required: Only the owner can edit the spot',
    });
  }
  if (address) spot.address = address;
  if (city) spot.city = city;
  if (state) spot.state = state;
  if (country) spot.country = country;
  if (lat) spot.lat = lat;
  if (lng) spot.lng = lng;
  if (name) spot.name = name;
  if (description) spot.description = description;
  if (price) spot.price = price;
  await spot.save();

  res.status(200).json(spot);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
    },
  });
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  } else if (req.user.id !== spot.ownerId) {
    return res.status(403).json({
      error: 'Authorization required: Only the owner can edit the spot',
    });
  }
  await Review.destroy({ where: { spotId: spot.id } });
  await spotImage.destroy({ where: { spotId: spot.id } });
  await Booking.destroy({ where: { spotId: spot.id } });
  await spot.destroy();
  return res.status(200).json({
    message: 'Successful deletion',
  });
});

router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  const review = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });
  if (!review.length) {
    return res.status(404).json({
      message: 'Spot has no reviews',
    });
  } else
    return res.status(200).json({
      Reviews: review,
    });
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }

  const findReview = await Review.findOne({
    where: {
      userId: userId,
      spotId: spotId,
    },
  });

  if (findReview) {
    return res.status(403).json({
      message: 'User already has a review for this spot',
    });
  }

  const { review, stars } = req.body;

  const newReview = await Review.create({
    review: review,
    stars: stars,
    userId: userId,
    spotId: spotId,
  });

  return res.status(201).json(newReview);
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const userBookings = await Booking.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  const spotBookings = await Booking.findAll({
    attributes: ['spotId', 'startDate', 'endDate'],
    where: {
      spotId: spotId,
    },
  });
  if (!spotBookings.length) {
    return res.status(404).json({
      message: 'Spot has no scheduled Bookings',
    });
  } else if (!userBookings.length) {
    return res.status(404).json({
      message: 'User has no scheduled Bookings',
    });
  } else if (userId === spot.ownerId) {
    return res.status(200).json(userBookings);
  } else return res.status(200).json(spotBookings);
});

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res) => {
  const spotIdParam = req.params.spotId;
  const spotId = parseInt(spotIdParam);
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (spot.ownerId === userId) {
    return res.status(403).json({
      message: "Spot can't be booked by owner",
    });
  }
  const { startDate, endDate } = req.body;
  const currDate = new Date();
  const parseStartDate = new Date(startDate);
  const parseEndDate = new Date(endDate);
  const parseStart = startDate;
  const parseEnd = endDate;

  const existingBookings = await Booking.findOne({
    where: {
      spotId: spotId,

      startDate: {
        [Op.lte]: parseStart,
      },
      endDate: {
        [Op.gte]: parseEnd,
      },
    },
  });
  const existingSurroundBookings = await Booking.findOne({
    where: {
      spotId: spotId,

      startDate: {
        [Op.gt]: parseStart,
      },
      endDate: {
        [Op.lt]: parseEnd,
      },
    },
  });

  const existingStartDate = await Booking.findOne({
    where: {
      spotId: spotId,
      startDate: {
        [Op.is]: parseStart,
      },
    },
  });

  const existingEndDate = await Booking.findOne({
    where: {
      spotId: spotId,
      endDate: {
        [Op.is]: parseStart,
      },
    },
  });

  const existingStartDateEnd = await Booking.findOne({
    where: {
      spotId: spotId,
      startDate: {
        [Op.is]: parseEnd,
      },
    },
  });

  const existingEndDateEnd = await Booking.findOne({
    where: {
      spotId: spotId,
      endDate: {
        [Op.is]: parseEnd,
      },
    },
  });

  const conflictingBookingProgress = await Booking.findOne({
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

  if (startDate === endDate) {
    return res.status(403).json({
      message: "Start & End can't be the same",
    });
  } else if (parseStartDate < currDate || parseEndDate < currDate) {
    return res.status(400).json({
      message: 'Dates in the past',
      errors: {
        startDate: "Start date can't be in the past",
        endDate: "End date can't be in the past",
      },
    });
  } else if (parseEnd <= parseStart) {
    return res.status(400).json({
      message: "End date can't be on or before startDate",
    });
  } else if (existingBookings) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date within existing booking',
        endDate: 'End Date within existing booking',
      },
    });
  } else if (existingSurroundBookings) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date surrounds an existing booking',
        endDate: 'End Date surrounds an existing booking',
      },
    });
  } else if (existingStartDate) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking start date',
      },
    });
  } else if (existingEndDate) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking end date',
      },
    });
  } else if (existingStartDateEnd) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        endDate: 'End date conflicts with an existing booking start date',
      },
    });
  } else if (existingEndDateEnd) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        endDate: 'End date conflicts with an existing booking end date',
      },
    });
  } else if (conflictingBookingProgress) {
    if (conflictingBookingProgress.startDate < parseStart) {
      return res.status(403).json({
        message: 'Booking conflict',
        errors: {
          endDate: 'Start date conflicts with an existing booking in progress',
        },
      });
    }
    if (conflictingBookingProgress.endDate > parseStart) {
      return res.status(403).json({
        message: 'Booking conflict',
        errors: {
          endDate: 'End date conflicts with an existing booking in progress',
        },
      });
    }
  }

  const newBooking = await Booking.create({
    spotId: spotId,
    userId: userId,
    startDate,
    endDate,
  });
  return res.status(201).json(newBooking);
});
module.exports = router;
