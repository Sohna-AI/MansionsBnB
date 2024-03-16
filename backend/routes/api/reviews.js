const express = require('express');
const router = express.Router();
const { User, Review, Spot, reviewImage, spotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const reviews = await Review.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        where: {
          id: userId,
        },
      },
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
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
      },
      {
        model: reviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });
  res.status(200).json(reviews);
});

const validImage = [check('url').notEmpty().withMessage('Must provide a url'), handleValidationErrors];

router.post('/:reviewId/reviewImages', validImage, requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({
      message: 'You are not authorized to add images',
    });
  }

  const imageCount = await reviewImage.count({
    where: {
      reviewId: reviewId,
    },
  });
  console.log(imageCount);
  const maxImage = 10;
  if (imageCount === maxImage) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached',
    });
  }

  const newImage = await reviewImage.create({
    url: url,
    reviewId: reviewId,
  });
  res.status(201).json({
    id: newImage.id,
    url: newImage.url,
  });
});

const validReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars').exists().isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

router.put('/:reviewId', validReview, requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const { review, stars } = req.body;
  const findReview = await Review.findByPk(reviewId);

  if (!findReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (findReview.userId !== userId) {
    return res.status(403).json({
      message: 'You are not authorized to edit this review',
    });
  }

  findReview.review = review;
  findReview.stars = stars;
  await findReview.save();

  res.status(200).json(findReview);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const findReview = await Review.findByPk(reviewId);

  if (!findReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (findReview.userId !== userId) {
    return res.status(403).json({
      message: 'You are not authorized to delete this review',
    });
  }

  await findReview.destroy();
  res.status(200).json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
