const express = require('express');
const router = express.Router();
const { User, Review, Spot, reviewImage, spotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateReview, validateReviewImage } = require('../../utils/validation');

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
  return res.status(200).json(reviews);
});

router.post('/:reviewId/images', validateReviewImage, requireAuth, async (req, res) => {
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

  const maxImage = 10;
  if (imageCount === maxImage) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached',
    });
  }
  if (imageCount < 10) {
    const newImage = await reviewImage.create({
      url: url,
      reviewId: reviewId,
    });
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });
  }
});

router.put('/:reviewId', validateReview, requireAuth, async (req, res) => {
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

  return res.status(200).json(findReview);
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
  return res.status(200).json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
