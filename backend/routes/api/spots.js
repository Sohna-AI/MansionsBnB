const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
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
    ],
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

module.exports = router;
