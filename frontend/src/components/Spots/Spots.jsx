import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './Spots.css';
import { NavLink, Outlet } from 'react-router-dom';

const Spots = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots);
  const spots = allSpots.list.map((spotId) => allSpots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getAllSpots = async () => {
      setIsLoaded(false);
      try {
        await dispatch(getSpots());
        setIsLoaded(true);
      } catch (error) {
        console.error('Error:', error);
        setIsLoaded(true);
      }
    };
    getAllSpots();
  }, [dispatch]);

  useEffect(() => {
    setIsLoaded(true);
  }, [isLoaded]);

  const avgRating = (el) => {
    if (el === 'Spot has no rating') return 'New';
    if (Number.isInteger(el)) {
      return `${el.toFixed(1)}`;
    } else return `${el.toFixed(2)}`;
  };

  return (
    isLoaded && (
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
                    <NavLink to={`/spots/${spot.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                      <img
                        className="spots-preview-image"
                        src={spot?.previewImage}
                        loading="eager"
                        title={spot.name}
                      />
                      <span className="spot-tooltip">{spot.name}</span>
                      <div className="spot-info-container">
                        <div className="spot-info">
                          {spot.city}, {spot.state}
                        </div>
                        <div className="spot-avg-rating">
                          <IoStar className="create-spot-star" /> {avgRating(spot.avgRating)}
                        </div>
                      </div>
                      <div className="spot-price-container">
                        <div className="spot-price" style={{ fontWeight: 'bold' }}>
                          ${spot.price} <span style={{ fontWeight: '200' }}>/night</span>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
        <Outlet />
      </>
    )
  );
};

export default Spots;
