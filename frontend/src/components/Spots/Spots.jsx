import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './Spots.css';
import { NavLink, Outlet } from 'react-router-dom';

const Spots = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots);
  const spots = allSpots.list.map((spotId) => allSpots[spotId]);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  const avgRating = (el) => {
    if (el === 'Spot has no rating') return 'New';
    if (Number.isInteger(el)) {
      return `${el.toFixed(1)}`;
    } else return `${el.toFixed(2)}`;
  };

  return (
    <>
      <main className="all-spots">
        <h1>Available Properties:</h1>
        <div className="spots-page-container">
          <ul className="spots-page">
            {allSpots.list.map((spotId) => {
              const spot = spots[spotId];
              if (!spot || !spot.id) return null;
              return (
                <li key={spot.id} className="single-spot">
                  <NavLink to={`/spots/${spot.id}`}>
                    <img className="spots-preview-image" src={spot.previewImage} title={spot.name} />
                  </NavLink>
                  <div className="spot-info-container">
                    <div className="spot-info">
                      {spot.city}, {spot.state}
                    </div>
                    <div className="spot-avg-rating">
                      <IoStar /> {avgRating(spot.avgRating)}
                    </div>
                  </div>
                  <div className="spot-price-container">
                    <div className="spot-price" style={{ fontWeight: 'bold' }}>
                      ${spot.price} <span style={{ fontWeight: '200' }}>/night</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Outlet />
    </>
  );
};

export default Spots;
