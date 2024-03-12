const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition',
    },
  });
  setTokenCookie(res, user);
  return res.json({
    user: user,
  });
});

module.exports = router;
