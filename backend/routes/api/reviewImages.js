const express = require('express');
const router = express.Router();
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const findReviewImage = await ReviewImage.findByPk(imageId);
  if (!findReviewImage) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }

  const findReview = await Review.findByPk(findReviewImage.reviewId);
  if (findReview.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Authorization required: Only the authorized User can delete this image',
    });
  } else {
    findReviewImage.destroy();
    return res.status(200).json({
      message: 'Successfully deleted',
    });
  }
});
module.exports = router;
