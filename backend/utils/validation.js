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
    .withMessage('Please provide a username with at 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
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
module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateSpot,
  validateSpotImage,
  validateReview,
  validateReviewImage,
  validateBooking,
};
