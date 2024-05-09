import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { getReviewsBySpotId, selectReviewArray } from '../../store/reviews';
import './SpotsDetails.css';
import DateDisplay from './DateDisplay';

const SpotsDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  const spot = useSelector((state) => state.spots[spotId]);

  const reviews = useSelector((state) => state.reviews);

  const reviewsArr = reviews.list.map((reviewId) => reviews[reviewId]);

  const numReview = (el) => {
    if (el === 1) return `${el} Review`;
    if (el === 0) return 'New';
    if (el > 1) return `${el}${' Reviews'}`;
  };

  const avgRating = (el) => {
    if (Number.isInteger(el)) {
      return `${el.toFixed(1)} ·`;
    } else return `${el.toFixed(2)} ·`;
  };

  useEffect(() => {
    const spotDetail = async () => {
      try {
        setIsLoaded(false);
        await dispatch(getSpotById(spotId));
        await dispatch(getReviewsBySpotId(spotId));
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching spot:', error);
        setIsLoaded(true);
      }
    };

    spotDetail();
  }, [spotId, dispatch]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return (
      <>
        <h1>Spot not found</h1>
      </>
    );
  }

  return (
    <>
      <div className="spot-details">
        <header className="spot-details-name-state">
          <h1>{spot.name}</h1>
          <h3>
            {spot.city},{spot.state}, {spot.country}
          </h3>
        </header>
        <main>
          <div>
            <img className="spot-detail-preview-image" src={spot.SpotImages[0].url} alt="" />
          </div>
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <div className="spot-detail-info-container">
            <div className="spot-detail-info">
              <p>{spot.description}</p>
              <div className="spot-detail-avg-price-reviews">
                <div className="spot-detail-price">
                  <span className="spot-price" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    ${spot.price}
                  </span>
                  <span className="spot-month" style={{ fontSize: 15 }}>
                    {' '}
                    Monthly
                  </span>
                  <div className="spot-detail-avg-rating-container">
                    <span className="spot-detail-avg-rating">
                      <IoStar />
                      {avgRating(spot.avgRating)}
                    </span>
                    <div className="spot-review-container">{numReview(spot.numReviews)}</div>
                  </div>
                  <button className="reserve-button">Reserve</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="spot-details-reviews-section">
        <h3 className="reviews-section-avg-num-reviews">
          <IoStar />
          {avgRating(spot.avgRating)} {numReview(spot.numReviews)}
        </h3>
        <ul className="review-section-user-info">
          {reviewsArr.map((review) => (
            <li key={review.id} className="review-section-comment">
              <div className="review-section-user">
                <p>{review.User.firstName}</p>
                <DateDisplay dateString={review.updatedAt.split(' ')[0]} />
              </div>
              <p>{review.reviewData}</p>
            </li>
          ))}
        </ul>
      </footer>
      <Outlet />
    </>
  );
};

export default SpotsDetails;
