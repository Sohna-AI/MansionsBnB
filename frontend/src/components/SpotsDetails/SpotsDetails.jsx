import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { getReviewsBySpotId } from '../../store/reviews';
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
    if (el === 'Spot has no rating') return 'New';

    if (Number.isInteger(el)) {
      return `${el.toFixed(1)} · `;
    } else return `${el.toFixed(2)} · `;
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

  const findPreviewImage = (spot) => {
    if (spot && Array.isArray(spot.SpotImages)) {
      const findPreview = spot.SpotImages.find((image) => image.preview);
      if (findPreview) return findPreview.url;
    }
    return '';
  };

  const findExtraImages = (spot) => {
    if (spot && Array.isArray(spot.SpotImages)) {
      return spot.SpotImages.filter((image) => !image.preview);
    }
    return [];
  };
  const extraImages = findExtraImages(spot);

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

  if (isLoaded) {
    return (
      <>
        <div className="spot-details">
          <main>
            <div className="spot-details-name-state-container">
              <div className="spot-details-name-state">
                <h1>{spot.name}</h1>
                <h3>
                  {spot.city},{spot.state}, {spot.country}
                </h3>
              </div>
            </div>
            <div className="spot-detail-container">
              <div className="spot-detail-images">
                <img className="spot-detail-preview-image" src={findPreviewImage(spot)} alt="" />
                <div className="spot-detail-extra-images">
                  {extraImages.map((image) => (
                    <img key={image.id} src={image.url} alt="" id="extra-images" />
                  ))}
                </div>
              </div>
              <div className="spot-detail-info-container">
                <h2 className="spot-detail-owner">
                  Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                </h2>
                <div className="spot-detail-info">
                  <p className="spot-description">{spot.description}</p>
                  <div className="spot-detail-avg-price-reviews">
                    <div className="spot-detail-price">
                      <div className="spot-detail-price-avg-container">
                        <span className="spot-price" style={{ fontSize: 20, fontWeight: 'bold' }}>
                          ${spot.price}/night
                        </span>
                        <div className="spot-detail-avg-rating-container">
                          <span className="spot-detail-avg-rating">
                            <IoStar />
                            {avgRating(spot.avgRating)}
                            {numReview(spot.numReviews)}
                          </span>
                        </div>
                      </div>
                      <button className="reserve-button">Reserve</button>
                    </div>
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
  }
};

export default SpotsDetails;
