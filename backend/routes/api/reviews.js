const express = require('express');
const router = express.Router();
const { User, Review, Spot, ReviewImage, SpotImage, sequelize } = require('../../db/models');
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
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });
  if (!reviews.length) {
    return res.status(404).json({
      title: "User's reviews",
      message: "User's reviews",
      errors: {
        message: 'User has not reviewed any spots',
      },
    });
  }
  const responseReviews = await Promise.all(
    reviews.map(async (review) => {
      const spot = review.Spot.toJSON();
      const previewImageFind = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spot.id,
          preview: true,
        },
      });
      const resReview = {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: review.User,
        Spot: {
          id: spot.id,
          ownerId: spot.ownerId,
          address: spot.address,
          city: spot.city,
          state: spot.state,
          country: spot.country,
          lat: Number(spot.lat),
          lng: Number(spot.lng),
          name: spot.name,
          description: spot.description,
          price: Number(spot.price),
        },
        ReviewImages: review.ReviewImages,
      };
      if (previewImageFind) {
        resReview.Spot.previewImage = previewImageFind.url;
      }
      return resReview;
    })
  );
  return res.status(200).json({ Reviews: responseReviews });
});

router.post('/:reviewId/images', requireAuth, validateReviewImage, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      title: 'Review image creation failed',
      message: 'Review not found',
      errors: {
        message: 'Requested review does not exist',
      },
    });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({
      title: 'Review image creation failed',
      message: 'Authorization Required',
      error: {
        message: 'You are not authorized to add an image',
      },
    });
  }

  const imageCount = await ReviewImage.count({
    where: {
      reviewId: reviewId,
    },
  });

  const maxImage = 10;
  if (imageCount === maxImage) {
    return res.status(403).json({
      title: 'Review image creation failed',
      message: 'Maximum number of review images',
      errors: {
        message: 'Maximum number of images for this resource was reached',
      },
    });
  }
  if (imageCount < 10) {
    const newImage = await ReviewImage.create({
      url: url,
      reviewId: reviewId,
    });
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });
  }
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const { review, stars } = req.body;
  const findReview = await Review.findByPk(reviewId);

  if (!findReview) {
    return res.status(404).json({
      title: 'Review editing failed',
      message: 'Review not found',
      errors: {
        message: 'Requestion review does not exist',
      },
    });
  }

  if (findReview.userId !== userId) {
    return res.status(403).json({
      title: 'Review editing failed',
      message: 'Authorization Required',
      errors: {
        message: 'You are not authorized to edit this review',
      },
    });
  }

  findReview.review = review;
  findReview.stars = stars;
  await findReview.save();

  return res.status(200).json({
    id: findReview.id,
    userId: findReview.userId,
    spotId: findReview.spotId,
    review: findReview.review,
    stars: findReview.stars,
    createdAt: findReview.createdAt,
    updatedAt: findReview.updatedAt,
  });
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const findReview = await Review.findOne({
    where: {
      id: reviewId,
    },
  });

  if (!findReview) {
    return res.status(404).json({
      title: 'Review deletion failed',
      message: 'Review not found',
      errors: {
        message: 'Requested review does not exist',
      },
    });
  }

  const userId = req.user.id;
  if (findReview.userId !== userId) {
    return res.status(403).json({
      title: 'Review deletion failed',
      message: 'Authorization Required',
      errors: {
        message: "You are not authorized to delete this review'",
      },
    });
  }

  await findReview.destroy();
  return res.status(200).json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
