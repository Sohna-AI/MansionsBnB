const express = require('express');
const router = express.Router();
const { User, Spot, Review, Booking, reviewImage, spotImage, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

router.get('/', async (_req, res) => {
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
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: spotImage,
        attributes: ['url'],
        where: { preview: true },
        as: 'previewImage',
        required: false,
      },
    ],
    group: ['Spot.id', 'previewImage.id'],
  });

  res.json(spots);
});

const validateSpot = [
  check('address').notEmpty().withMessage('Address is required'),
  check('city').notEmpty().withMessage('city is required'),
  check('state')
    .notEmpty()
    .withMessage('state is required')
    .isLength(2)
    .withMessage('State must be abbreviated'),
  check('country').notEmpty().withMessage('country is required'),
  check('lat').notEmpty().withMessage('lat is required').isNumeric().withMessage('Lat must be a number'),
  check('lng').notEmpty().withMessage('lng is required').isNumeric().withMessage('Lng must be a number'),
  check('name').notEmpty().withMessage('name is required'),
  check('description').notEmpty().withMessage('description is required'),
  check('price')
    .notEmpty()
    .withMessage('price is required')
    .isNumeric()
    .withMessage('price must be a number'),
  handleValidationErrors,
];

router.post('/', validateSpot, requireAuth, async (req, res) => {
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

  res.status(201).json(newSpot);
});

const validSpotImage = [
  check('url').notEmpty().withMessage('Must link an image'),
  check('preview').isBoolean().withMessage('Must be true or false'),
  handleValidationErrors,
];

router.post('/:spotId/spotImages', validSpotImage, requireAuth, async (req, res) => {
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

  res.status(201).json(newImage);
});

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

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

  res.status(200).json(spot);
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
      [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 1), 'avgRating'],
      [Sequelize.fn('COUNT', Sequelize.col('reviews.id')), 'numReviews'],
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
      },
      {
        model: spotImage,
        attributes: ['id', 'url', 'preview'],
        as: 'spotImages',
      },
    ],
    group: ['Spot.id', 'spotImages.id'],
  });
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }
  res.status(200).json(spot);
});

router.put('/:spotId', requireAuth, async (req, res) => {
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
  if (description) spot.description = description;
  if (price) spot.price = price;
  await spot.save();

  res.status(200).json(spot);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ error: "Spot couldn't be found" });
  }

  if (req.user.id !== spot.ownerId) {
    return res.status(403).json({
      error: 'Authorization required: Only the owner can edit the spot',
    });
  }
  await spot.destroy();
  res.status(200).json({
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
        model: reviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });

  res.status(200).json(review);
});

const validReview = [
  check('review').notEmpty().withMessage('Review must not be empty'),
  check('stars')
    .exists()
    .withMessage('Star rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Star rating can ONLY be between 1 - 5'),
  handleValidationErrors,
];
router.post('/:spotId/reviews', validReview, requireAuth, async (req, res) => {
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

router.get('/:spotId/bookings', async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (userId === spot.ownerId) {
    const bookings = await Booking.findAll({
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
    return res.status(200).json(bookings);
  } else {
    const bookings = await Booking.findAll({
      attributes: ['spotId', 'startDate', 'endDate'],
      where: {
        spotId: spotId,
      },
    });
    return res.status(200).json(bookings);
  }
});

const validBooking = [
  check('startDate').notEmpty().withMessage('Must be a date'),
  check('endDate').notEmpty().withMessage('Must be a date'),
  handleValidationErrors,
];

router.post('/:spotId/bookings', validBooking, requireAuth, async (req, res) => {
  const { spotId } = req.params;
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
  const parseStart = new Date(startDate);
  const parseEnd = new Date(endDate);

  if (parseStart < currDate) {
    return res.status(400).json({
      message: 'Start date cannot be in the past',
    });
  }

  if (parseEnd <= parseStart) {
    return res.status(400).json({
      message: 'End date cannot be on or before startDate',
    });
  }

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
  if (existingBookings) {
    return res.status(403).json({
      message: 'Booking conflict',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End Date conflicts wiht an existing booking',
      },
    });
  }
  if (userId !== spot.ownerId) {
    const newBooking = await Booking.create({
      spotId: spotId,
      userId: userId,
      startDate: parseStart,
      endDate: parseEnd,
    });

    return res.status(201).json(newBooking);
  }
});
module.exports = router;
