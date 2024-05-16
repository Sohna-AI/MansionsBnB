import StarRating from './StarRating';
import { useDispatch } from 'react-redux';
import { createReview, getReviewsBySpotId } from '../../store/reviews';
import './CreateReviews.css';
import { useState } from 'react';

const CreateReviews = ({ spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [starRating, setStarRating] = useState(0);

  const handleReviewChange = (e) => {
    const { value } = e.target;
    setReview(value);
  };

  const handleStarRatingChange = (rating) => {
    setStarRating(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewPayload = {
      review: review,
      stars: starRating,
    };

    if (reviewPayload) {
      try {
        await dispatch(createReview(reviewPayload, spotId));
        await dispatch(getReviewsBySpotId(spotId));
        closeModal();
      } catch (error) {
        console.error('failed to create review:', error);
      }
    }
  };

  const reviewLength = review.length < 10;
  const rating = starRating === 0;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="create-review-container">
          <div className="create-review-page">
            <h1 className="create-review-title">How was your stay?</h1>
            <main className="create-review-main-container">
              <textarea
                name="review"
                value={review}
                onChange={handleReviewChange}
                rows={5}
                cols={30}
                className="create-review-form-style"
                placeholder="Leave your review here..."
                required
              ></textarea>
              <div>
                <StarRating value={starRating} onChange={handleStarRatingChange} />
              </div>
            </main>
            <footer>
              <div className="create-review-button-container">
                <button className="create-review-button" type="submit" disabled={reviewLength || rating}>
                  Submit Your Review
                </button>
              </div>
              <div className="create-review-cancel-button-container">
                <button className="create-review-cancel-button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </footer>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateReviews;
