const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js');
const spotImageRouter = require('./spotImages.js');
const reviewImageRouter = require('./reviewImages.js');
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', userRouter);

router.use('/spots', spotRouter);

router.use('/reviews', reviewRouter);

router.use('/bookings', bookingRouter);

router.use('/spot-images', spotImageRouter);

router.use('/review-images', reviewImageRouter);

router.post('/test', (req, res) => {
  res.json({
    requestBody: req.body,
  });
});

module.exports = router;
