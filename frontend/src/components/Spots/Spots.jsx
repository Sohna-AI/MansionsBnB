import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { Outlet } from 'react-router-dom';

const Spots = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots).list;
  console.log(allSpots);
  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  return (
    <>
      <main>
        <h1>Spots:</h1>
        <ul>
          {allSpots.map((spot) => (
            <li id={spot.id}>{spot.name}</li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Spots;
