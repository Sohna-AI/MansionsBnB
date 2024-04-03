const { validationResult, check } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach((error) => (errors[error.path] = error.msg));

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const validateSignup = [
  check('email').exists({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('firstName').exists({ checkFalsy: true }).withMessage('First Name is required'),
  check('lastName').exists({ checkFalsy: true }).withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors,
];

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username'),
  check('password').exists({ checkFalsy: true }).withMessage('Please provide a password'),
  handleValidationErrors,
];

const isValidLatitude = (value) => {
  const latitude = parseFloat(value);
  return latitude >= -90 && latitude <= 90;
};

const isvalidLongitude = (value) => {
  const longitude = parseFloat(value);
  return longitude >= -180 && longitude <= 180;
};

const isValidPrice = (value) => {
  const price = parseFloat(value);
  return price >= 0;
};

const validateSpot = [
  check('address').notEmpty().withMessage('Address is required'),
  check('city').notEmpty().withMessage('city is required'),
  check('state').notEmpty().withMessage('state is required'),
  check('country').notEmpty().withMessage('country is required'),
  check('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isDecimal()
    .withMessage('Latitude must be a decimal number')
    .custom(isValidLatitude)
    .withMessage('Latitude must be between -90 and 90'),
  check('lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .isDecimal()
    .withMessage('Longitude must be a decimal number')
    .custom(isvalidLongitude)
    .withMessage('Longitude must be between -180 and 180'),
  check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description').notEmpty().withMessage('description is required'),
  check('price')
    .notEmpty()
    .withMessage('price is required')
    .isDecimal()
    .custom(isValidPrice)
    .withMessage('price per day must be a positive number'),
  handleValidationErrors,
];

const validateSpotImage = [
  check('url').notEmpty().withMessage('Must link an image'),
  check('preview').isBoolean().withMessage('Must be true or false'),
  handleValidationErrors,
];

const validateReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars')
    .exists()
    .withMessage('Star rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];
const validateReviewImage = [
  check('url').notEmpty().withMessage('Must provide a url'),
  handleValidationErrors,
];

const validateBooking = [
  check('startDate').notEmpty().withMessage('Must be a date'),
  check('endDate').notEmpty().withMessage('Must be a date'),
  handleValidationErrors,
];

const validateQueryParams = [
  check('page').optional().isInt({ min: 1, max: 10 }).withMessage('Page must be greater than or equal to 1'),
  check('size').optional().isInt({ min: 1, max: 20 }).withMessage('Size must be greater than or equal to 1'),
  check('minLat').optional().isFloat().withMessage('Minimum latitude is invalid'),
  check('maxLat').optional().isFloat().withMessage('Maximum latitude is invalid'),
  check('minLng').optional().isFloat().withMessage('Minimum longitude is invalid'),
  check('maxLng').optional().isFloat().withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors,
];
module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateSpot,
  validateSpotImage,
  validateReview,
  validateReviewImage,
  validateBooking,
  validateQueryParams,
};
