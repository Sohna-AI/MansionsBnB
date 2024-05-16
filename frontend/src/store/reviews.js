import { csrfFetch } from './csrf';
import { sortList } from './spots';
import { createSelector } from '@reduxjs/toolkit';

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const REMOVE = 'reviews/REMOVE';

const load = (reviews, spotId) => ({
  type: LOAD_REVIEWS,
  reviews,
  spotId,
});

const add = (review) => ({
  type: ADD_REVIEW,
  review,
});

const remove = (removeId) => ({
  type: REMOVE,
  removeId,
});

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
      const reviews = await res.json();
      dispatch(load(reviews, spotId));
      return reviews;
    }
  } catch (error) {
    console.error('Error Fetching reviews:', error);
  }
};

export const createReview = (data, spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newReview = await res.json();
      console.log('NEW_REVIEW:', newReview);
      dispatch(add(newReview));
      return newReview;
    }
  } catch (error) {
    console.error('Error creating review:', error.message);
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(remove(reviewId));
    return;
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
    case ADD_REVIEW: {
      console.log(action);
      if (!state[action.review.id]) {
        const newState = {
          ...state,
          [action.review.id]: action.review,
          ...action.review.User,
        };
        const reviewList = newState.list.map((id) => newState[id]);
        reviewList.push(action.review);
        newState.list = sortList(reviewList);
        console.log(newState);
        return newState;
      }

      const newReview = {
        ...state,
        [action.review.id]: action.review,
      };

      return newReview;
    }
    case REMOVE: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
