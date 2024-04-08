const express = require('express');
const bcrypt = require('bcryptjs');
const { validateSignup } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;
  const existingUserEmail = await User.unscoped().findOne({
    where: {
      email: email,
    },
  });
  const existingUserName = await User.unscoped().findOne({
    where: {
      username: username,
    },
  });
  if (existingUserEmail) {
    return res.status(500).json({
      title: 'Signup failed',
      message: 'User already exists',
      errors: {
        email: 'User with that email already exists',
      },
    });
  }

  if (existingUserName) {
    return res.status(500).json({
      title: 'Signup failed',
      messsage: 'Use already exists',
      errors: {
        username: 'User with that username already exists',
      },
    });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

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
