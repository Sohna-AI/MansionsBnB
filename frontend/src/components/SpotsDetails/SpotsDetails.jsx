import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import './SpotsDetails.css';

const SpotsDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  console.log(spot);

  useEffect(() => {
    const spotDetail = async () => {
      await dispatch(getSpotById(spotId));
    };

    spotDetail();
  }, [spotId, dispatch]);
  return (
    <>
      <h1>{spot.name}</h1>
      <h3>
        {spot.city},{spot.state}, {spot.country}
      </h3>
      <div>
        <img className="spot-detail-preview-image" src={spot.previewImage} alt="" />
      </div>
      <h2>
        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
      </h2>
      <div>
        <p>{spot.description}</p>
        <span style={{ fontSize: 20, fontWeight: 'bold' }}>${spot.price}</span>
        <span style={{ fontSize: 15 }}> Monthly</span>
        <div>
          <span className='spot-detail-avg-rating'>
            <IoStar /> {spot.avgRating}
          </span>
          <span>{}</span>
        </div>
      </div>
    </>
  );
};

export default SpotsDetails;
