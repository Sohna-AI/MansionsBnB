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
    ],
    group: ['Spot.id'],
    where: filter,
    limit: pageSize,
    offset: offset,
    order: [['id', 'ASC']],
  });

  const responseSpots = await Promise.all(
    spots.map(async (spot) => {
      const { Reviews, previewImage, ...spotData } = spot.toJSON();
      const previewImageFind = await spotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spotData.id,
          preview: true,
        },
        as: 'previewImage',
      });
      const responseSpot = {
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
      };
      const avgRating = await calculateAverageRating(spot.id);
      if (avgRating > 0 && avgRating !== null) {
        responseSpot.avgRating = avgRating;
      } else {
        responseSpot.avgRating = 'Spot has no rating';
      }
      if (previewImageFind) {
        responseSpot.previewImage = previewImageFind.url;
      } else {
        responseSpot.previewImage = 'Spot has no preview image';
      }
      return responseSpot;
    })
  );

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

  return res.status(201).json({
    id: newSpot.id,
    ownerId: newSpot.ownerId,
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
    createdAt: newSpot.createdAt,
    updatedAt: newSpot.updatedAt,
  });
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

  const spotImg = await spotImage.findOne({
    where: {
      spotId: spotId,
      preview: true,
    },
  });

  if (spotImg) {
    return res.status(403).json({
      message: "Can't have more than 1 spot image as preview",
    });
  } else {
    const newImage = await spotImage.create({
      spotId: spotId,
      url: url,
      preview: preview,
    });
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  }
});

router.get('/current', requireAuth, async (req, res) => {
  const userIdParam = req.user.id;
  const userId = parseInt(userIdParam);

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
    ],
    group: ['Spot.id'],
  });
  if (!spots.length) {
    return res.status(200).json({
      message: 'User has no spots',
    });
  }

  const responseSpots = await Promise.all(
    spots.map(async (spot) => {
      const { Reviews, previewImage, ...spotData } = spot.toJSON();
      const previewImageFind = await spotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spotData.id,
          preview: true,
        },
        as: 'previewImage',
      });
      const responseSpot = {
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
      };
      const avgRating = await calculateAverageRating(spot.id);
      if (avgRating > 0 && avgRating !== null) {
        responseSpot.avgRating = avgRating;
      } else {
        responseSpot.avgRating = 'Spot has no rating';
      }
      if (previewImageFind) {
        responseSpot.previewImage = previewImageFind.url;
      } else {
        responseSpot.previewImage = 'Spot has no preview image';
      }
      return responseSpot;
    })
  );
  return res.status(200).json({ Spots: responseSpots });
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
    ],
    include: [
      {
        model: Review,
        attributes: [],
        duplicating: false,
        required: false,
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        as: 'Owner',
      },
    ],
    group: ['Spot.id', 'Owner.id'],
  });
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  const response = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  };
  const avgRating = await calculateAverageRating(spot.id);
  if (avgRating > 0 && avgRating !== null) {
    response.avgRating = avgRating;
  } else {
    response.avgRating = 'Spot has no rating';
  }

  const spotImg = await spotImage.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'spotId'],
    },
    where: {
      spotId: spot.id,
    },
    group: ['id'],
    order: [['id', 'ASC']],
  });
  if (spotImg.length) {
    response.spotImages = spotImg;
  } else {
    response.spotImages = 'Spot has no images';
  }
  response.Owner = spot.Owner;
  return res.status(200).json(response);
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

  res.status(200).json({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  });
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
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  const reviews = await Review.findAll({
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
  if (!reviews.length) {
    return res.status(404).json({
      message: 'Spot has no reviews',
    });
  }
  const responseReviews = await reviews.map((review) => {
    const { ...reviewData } = review.toJSON();
    return {
      id: reviewData.id,
      userId: reviewData.userId,
      spotId: reviewData.spotId,
      reviewData: reviewData.review,
      stars: reviewData.stars,
      createdAt: reviewData.createdAt,
      updatedAt: reviewData.updatedAt,
      User: reviewData.User,
      ReviewImages: reviewData.ReviewImages,
    };
  });
  return res.status(200).json({ Reviews: responseReviews });
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
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

  return res.status(201).json({
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt,
  });
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
    return res.status(200).json({ Bookings: userBookings });
  } else return res.status(200).json({ Bookings: spotBookings });
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
      message: "Start & End dates can't be the same",
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
      message: "End date can't be on or before start date",
    });
  } else if (existingConflicts) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
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
          startDate: "Start date can't be during an existing booking",
        },
      });
    }
    if (conflictingBookingProgress.endDate > parseStart) {
      return res.status(403).json({
        message: 'Booking conflict',
        errors: {
          endDate: "End date can't be during an existing booking",
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
  return res.status(201).json({
    id: newBooking.id,
    spotId: newBooking.spotId,
    userId: newBooking.userId,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    createdAt: newBooking.createdAt,
    updatedAt: newBooking.updatedAt,
  });
});
module.exports = router;
