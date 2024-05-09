import { sortList } from './spots';
import { createSelector } from '@reduxjs/toolkit';

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

const load = (reviews, spotId) => ({
  type: LOAD_REVIEWS,
  reviews,
  spotId,
});

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(load(reviews, spotId));
    return reviews;
  }
};

const selectReviews = (state) => state.reviews;

export const selectReviewArray = createSelector(selectReviews, (reviews) => Object.values(reviews));

const initialState = {
  list: [],
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      const allReviews = {};
      action.reviews.Reviews.forEach((review) => {
        allReviews[review.id] = review;
      });
      return {
        ...state,
        ...allReviews,
        list: sortList(action.reviews.Reviews),
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
