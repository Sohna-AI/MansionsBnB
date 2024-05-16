import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { deleteReview, getReviewsBySpotId } from '../../store/reviews';
import './SpotsDetails.css';
import DateDisplay from './DateDisplay';
import CreateReviews from '../CreateReviews/CreateReviews';
import DeleteSpot from '../DeleteSpot/DeleteSpot';

const StarRating = ({ rating }) => {
  const filledStars = [];
  for (let i = 0; i < 5; i++) {
    filledStars.push(<IoStar key={i} color={i < rating ? '#e99f4c' : 'gray'} size={20}/>);
  }
  return <div>{filledStars}</div>;
};

const SpotsDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const modalRef = useRef(null);
  useEffect(() => {
    const fetchSpotDetailsAndReviews = async () => {
      setIsLoaded(false);

      try {
        await dispatch(getSpotById(spotId));

        dispatch(getReviewsBySpotId(spotId));

        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching spot details and reviews:', error);
        setIsLoaded(true);
      }
    };

    fetchSpotDetailsAndReviews();
  }, [spotId, dispatch]);

  useEffect(() => {
    if (sessionUser === null) {
      setIsLoggedIn(false);
    } else setIsLoggedIn(true);
  }, [sessionUser]);

  const spot = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector((state) => state.reviews);
  const reviewsArray = reviews.list.map((reviewId) => reviews[reviewId]);
  const reviewsArr = reviewsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

  const userPostedReview = (reviews, userId) => {
    const actualUserId = sessionUser?.id;
    if (!Array.isArray(reviews) || typeof userId !== 'number') {
      return false;
    }
    return reviews?.some((review) => review.userId === actualUserId);
  };

  const userIsSpotOwner = (spot, userId) => {
    return spot.Owner.id === userId;
  };

  const renderPostReviewButton = () => {
    if (!isLoggedIn) return false;
    else if (userIsSpotOwner(spot, sessionUser.id)) return false;
    else if (userPostedReview(reviewsArr, sessionUser.id)) return false;
    else return true;
  };

  const openDeleteModal = (reviewId) => {
    setDeleteReviewId(reviewId);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setDeleteReviewId(null);
    setDeleteModalOpen(false);
  };
  const confirmDeleteReview = async () => {
    try {
      await dispatch(deleteReview(deleteReviewId)).then(closeModal());
      setDeleteReviewId(null);
      await dispatch(getReviewsBySpotId(spotId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  const handleOpenReviewModal = () => {
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
  };
  if (!isLoaded || !spot || !reviewsArray) {
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
                          ${spot.price}
                          <span style={{ fontWeight: '200' }}>/night</span>
                        </span>
                        <div className="spot-detail-avg-rating-container">
                          <span className="spot-detail-avg-rating">
                            <IoStar className="spot-detail-star" />
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
            <IoStar className="spot-detail-star" />
            {avgRating(spot.avgRating)} {numReview(spot.numReviews)}
          </h3>
          {renderPostReviewButton() && (
            <div className="post-review-button-container">
              <button style={{ listStyle: 'none', cursor: 'pointer' }} onClick={handleOpenReviewModal}>
                Post Your Review
              </button>
            </div>
          )}
          {!reviewsArr.length && renderPostReviewButton() && <p>Be first to post a review</p>}
          <ul className="review-section-user-info">
            {reviewsArr.map((review) => (
              <li key={review.id} className="review-section-comment">
                <div className="review-section-user">
                  <p style={{fontWeight: 700}}>{review.User?.firstName}</p>
                  <div style={{fontWeight: 300}}><DateDisplay dateString={review.updatedAt.split(' ')[0]} /></div>
                  <div className="spot-detail-review-stars">
                    <p style={{fontWeight: 500}}>Rated: <span style={{fontWeight: 700, fontSize: 16}}>{review.stars}</span></p>
                    <StarRating rating={review.stars} />
                  </div>
                </div>
                <p>{review.reviewData}</p>
                {sessionUser && sessionUser.id === review.userId && (
                  <button onClick={() => openDeleteModal(review.id)} style={{ cursor: 'pointer' }}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </footer>
        {reviewModalOpen && (
          <div className="dim-overlay visible">
            <div className="create-review-modal" ref={modalRef}>
              <CreateReviews spotId={spotId} closeModal={handleCloseReviewModal} />
            </div>
          </div>
        )}
        {deleteModalOpen && <div className="dim-overlay visible"></div>}
        {deleteModalOpen && (
          <DeleteSpot
            reviewId={deleteReviewId}
            closeModal={closeModal}
            handleDelete={confirmDeleteReview}
            title="Confirm Delete"
            subTitle="Are you sure you want to delete this review?"
            confirmText="Yes (Delete Review)"
            cancelText="No (Keep Review)"
          />
        )}
        <Outlet />
      </>
    );
  }
};

export default SpotsDetails;
