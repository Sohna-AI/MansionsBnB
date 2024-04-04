const express = require('express');
const router = express.Router();
const { spotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:spotImageId', requireAuth, async (req, res) => {
  const imageId = req.params.spotImageId;
  console.log(imageId);
  const findSpotImage = await spotImage.findByPk(imageId);
  if (!findSpotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  const spotId = findSpotImage.spotId;
  const spot = await Spot.findByPk(spotId);

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: 'Authorization required: Only the owner can delete this image',
    });
  } else {
    await findSpotImage.destroy();
    return res.status(200).json({
      message: 'Successfully deleted',
    });
  }
});

module.exports = router;
