const express = require('express');
const router = express.Router();
const { User, Spot, Review, Booking, reviewImage, spotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {
  validateBooking,
  validateReview,
  validateSpot,
  validateSpotImage,
} = require('../../utils/validation');
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
      [sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Spot.id = Reviews.spotId)'), 'avgRating'],
    ],
    include: [
      {
        model: spotImage,
        attributes: ['url'],
        where: { preview: true },
        as: 'previewImage',
        required: false,
      },
    ],
    group: ['Spot.id'],
  });
  res.json(spots);
});

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

router.post('/:spotId/spotImages', validateSpotImage, requireAuth, async (req, res) => {
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
      [sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Spot.id = Reviews.spotId)'), 'avgRating'],
    ],
    where: {
      ownerId: userId,
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
      [sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Spot.id = Reviews.spotId)'), 'avgRating'],
      [sequelize.literal('(SELECT COUNT(*) FROM Reviews WHERE Spot.id = Reviews.spotId)'), 'numReviews'],
    ],
    include: [
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

router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res) => {
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

router.post('/:spotId/bookings', validateBooking, requireAuth, async (req, res) => {
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
      message: "Start date can't be in the past",
    });
  }

  if (parseEnd <= parseStart) {
    return res.status(400).json({
      message: "End date can't be on or before startDate",
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
