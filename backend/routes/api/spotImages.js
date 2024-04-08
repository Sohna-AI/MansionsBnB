const express = require('express');
const router = express.Router();
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:spotImageId', requireAuth, async (req, res) => {
  const imageId = req.params.spotImageId;
  const findSpotImage = await SpotImage.findByPk(imageId);
  if (!findSpotImage) {
    return res.status(404).json({
      title: 'Spot image deletion failed',
      message: 'Spot image not found',
      errors: {
        message: 'Spot Image does not exist',
      },
    });
  }

  const spotId = findSpotImage.spotId;
  const spot = await Spot.findByPk(spotId);

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      title: 'Spot image deletion failed',
      message: 'Authorization Required',
      errors: {
        message: "Only the owner can delete this image'",
      },
    });
  } else {
    await findSpotImage.destroy();
    return res.status(200).json({
      message: 'Successfully deleted',
    });
  }
});

module.exports = router;
