const { Op } = require('sequelize');
const { Review } = require('../db/models');

const buildFilter = (query) => {
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
  const filter = {};
  if (query.minLat) filter.lat = { [Op.gte]: parseFloat(minLat) };
  if (query.maxLat) filter.lat = { ...filter.lat, [Op.lte]: parseFloat(maxLat) };
  if (query.minLng) filter.lng = { [Op.gte]: parseFloat(minLng) };
  if (query.maxLng) filter.lng = { ...filter.lng, [Op.lte]: parseFloat(maxLng) };
  if (query.minPrice) filter.price = { [Op.gte]: parseFloat(minPrice) };
  if (query.maxPrice) filter.price = { ...filter.price, [Op.lte]: parseFloat(maxPrice) };
  return filter;
};

async function calculateAverageRating(spotId) {
  try {
    const reviews = await Review.findAll({
      attributes: ['stars'],
      where: { spotId: spotId },
    });

    if (reviews.length === 0) return 0;

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return totalStars / reviews.length;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return null;
  }
}

module.exports = {
  calculateAverageRating,
  buildFilter,
};
