import './DeleteSpot.css';

const DeleteSpot = ({ closeModal, handleDelete, subTitle, confirmText, cancelText }) => {
  const confirmDelete = () => {
    handleDelete();
  };
  return (
    <>
      <div className="delete-spot-page-container">
        <div className="delete-spot-page">
          <h1 className="delete-spot-title">Confirm Delete</h1>
          <h3 className="delete-spot-sub-title">{subTitle}</h3>
          <div>
            <div className="delete-button-container">
              <button className="delete-spot-delete-button" onClick={confirmDelete}>
                {confirmText}
              </button>
            </div>
            <div className="cancel-button-container">
              <button className="delete-spot-cancel-button" onClick={closeModal}>
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteSpot;
