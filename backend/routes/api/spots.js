const express = require('express');
const router = express.Router();
const { User, Spot, Review, spotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

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
    res.status(404).json({ error: `Spot not found for id ${spotId}` });
  }

  if (req.user.id !== spot.ownerId) {
    res.status(403).json({
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
    res.status(404).json({ error: `Spot not found for id ${spotId}` });
  }
  res.status(200).json(spot);
});

router.put('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  if (!spot) {
    res.status(404).json({ error: `Spot not found for id ${spotId}` });
  }
  if (req.user.id !== spot.ownerId) {
    res.status(403).json({
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
    res.status(404).json({ error: `Spot not found for id ${spotId}` });
  }

  if (req.user.id !== spot.ownerId) {
    res.status(403).json({
      error: 'Authorization required: Only the owner can edit the spot',
    });
  }
  await spot.destroy();
  res.status(200).json({
    message: 'Successful deletion',
  });
});
module.exports = router;
