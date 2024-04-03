const express = require('express');
const bcrypt = require('bcryptjs');
const { validateSignup } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  const existingUserEmail = await User.unscoped().findOne({
    where: {
      email: email,
    },
  });

  if (existingUserEmail) {
    const error = new Error('Signup failed');
    error.status = 500;
    error.title = 'User already exists';
    error.errors = {
      email: 'User with that email already exists',
    };
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

module.exports = router;
