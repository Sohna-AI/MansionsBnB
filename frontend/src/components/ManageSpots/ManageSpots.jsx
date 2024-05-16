import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { deleteSpot, getSpots } from '../../store/spots';
import DeleteSpot from '../DeleteSpot/DeleteSpot';

import './ManageSpots.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const currentSpots = useSelector((state) => state.spots);
  const sessionUser = useSelector((state) => state.session.user);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  const userSpots = currentSpots.list
    .map((spotId) => currentSpots[spotId])
    .filter((spot) => spot && spot.ownerId === sessionUser.id);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  const avgRating = (el) => {
    if (el === 'Spot has no rating') return 'New';
    if (Number.isInteger(el)) {
      return `${el.toFixed(1)}`;
    } else return `${el.toFixed(2)}`;
  };

  const openDeleteModal = (spotId) => {
    setSpotToDelete(spotId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSpotToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteSpot = () => {
    dispatch(deleteSpot(spotToDelete)).then(() => {
      closeDeleteModal();
    });
  };

  return (
    <>
      <main className="manage-spots">
        <h1>Manage Your Spots</h1>
        {!userSpots.length && (
          <NavLink to="/spots/new">
            <button className="create-spot-button">Create a spot</button>
          </NavLink>
        )}
        <div className="manage-spots-page-container">
          <ul className="manage-spots-page">
            {userSpots.map((spot) => (
              <li key={spot.id} className="manage-single-spot">
                <NavLink to={`/spots/${spot.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <img className="manage-spots-preview-image" src={spot.previewImage}/>
                  <span className='manage-spot-tooltip'>{spot.name}</span>
                  <div className="manage-spot-info-container">
                    <div className="manage-spot-info">
                      {spot.city}, {spot.state}
                    </div>
                    <div className="manage-spot-avg-rating">
                      {' '}
                      <IoStar className="manage-spot-star" /> {avgRating(spot.avgRating)}
                    </div>
                  </div>
                  <div>
                    <div className="manage-spot-price" style={{ fontWeight: 'bold' }}>
                      ${spot.price} <span style={{ fontWeight: '200' }}>/night</span>
                    </div>
                  </div>
                </NavLink>
                <div className="spot-update-delete-button-container">
                  <NavLink to={`/spots/${spot.id}/edit`} style={{ textDecoration: 'none' }}>
                    <button className="manage-spot-delete-button">
                      <div className="sign">
                        <svg viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </div>
                      <div className="text">Update</div>
                    </button>
                  </NavLink>
                  <div>
                    <button onClick={() => openDeleteModal(spot.id)} className="manage-spot-delete-button">
                      <div className="sign">
                        <svg
                          viewBox="0 0 16 16"
                          className="bi bi-trash3-fill"
                          fill="currentColor"
                          height="18"
                          width="18"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"></path>
                        </svg>
                      </div>
                      <div className="text">Delete</div>
                    </button>
                  </div>
                  <div>
                    <NavLink to={`/spots/${spot.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                      <div className="manage-spot-empty-box">clickable space</div>
                    </NavLink>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {deleteModalOpen && <div className="dim-overlay visible"></div>}
      {deleteModalOpen && (
        <DeleteSpot
          spotId={spotToDelete}
          closeModal={closeDeleteModal}
          handleDelete={handleDeleteSpot}
          title="Confirm Delete"
          subTitle="Are your sure you want to remove this spot from the listings?"
          confirmText="Yes (Delete Spot)"
          cancelText="No (Keep Spot)"
        />
      )}
    </>
  );
};

export default ManageSpots;
