import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './Spots.css';

const Spots = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots).list;

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  return (
    <>
      <main>
        <h1>Available Properties:</h1>
        <div className="spots-page-container">
          <ul className="spots-page">
            {allSpots.map((spot) => (
              <li key={spot.id} className="single-spot">
                <img className="spots-preview-image" src={spot.previewImage} alt={spot.name} />
                <div className="spot-info-container">
                  <div className="spot-info">
                    {spot.city}, {spot.state}
                  </div>
                  <div className="spot-avg-rating">
                    <IoStar /> {spot.avgRating}
                  </div>
                </div>
                <div className="spot-price-container">
                  <div className="spot-price" style={{ fontWeight: 'bold' }}>
                    ${spot.price}
                  </div>
                  /month
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Spots;
