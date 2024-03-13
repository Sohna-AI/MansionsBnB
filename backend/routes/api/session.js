const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {check} = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [
  check('credential')
  .exists({checkFalsy: true})
  .notEmpty()
  .withMessage('Please provide a valid email or username'),
  check('password')
  .exists({checkFalsy: true})
  .withMessage('Please provide a password'),
  handleValidationErrors
]

router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const error = new Error('Login failed');
    error.status = 401;
    error.title = 'Login failed';
    error.errors = {
      credential: 'The provided credentials were invalid.',
    };
    return next(error);
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  const success = {
    message: 'success',
  };
  return res.json(success);
});

router.get('/', (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

module.exports = router;
