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
        <div className="manage-spots-page-container">
          <ul className="manage-spots-page">
            {userSpots.map((spot) => (
              <li key={spot.id} className="manage-single-spot">
                <NavLink to={`/spots/${spot.id}`}>
                  <img className="manage-spots-preview-image" src={spot.previewImage} title={spot.name} />
                </NavLink>
                <div className="manage-spot-info-container">
                  <div className="manage-spot-info">
                    {spot.city}, {spot.state}
                  </div>
                  <div className="manage-spot-avg-rating">
                    {' '}
                    <IoStar /> {avgRating(spot.avgRating)}
                  </div>
                </div>
                <div>
                  <div className="manage-spot-price" style={{ fontWeight: 'bold' }}>
                    ${spot.price} <span style={{ fontWeight: '200' }}>/night</span>
                  </div>
                </div>
                <div className="spot-update-delete-button-container">
                  <NavLink to={`/spots/${spot.id}/edit`}>
                    <button>Update</button>
                  </NavLink>
                  <div>
                    <button onClick={() => openDeleteModal(spot.id)}>Delete</button>
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
