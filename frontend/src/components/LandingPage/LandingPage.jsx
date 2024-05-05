import { Outlet, useNavigate } from 'react-router-dom';
import landing_page from '../../../../images/landing-page.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleEnterButton = () => {
    navigate('/spots');
  };
  return (
    <>
      <div className="landing-page-image-container">
        <img className="landing-page-image" src={landing_page} alt="" />
        <button className="landing-page-button" onClick={handleEnterButton}>
          Enter
        </button>
      </div>
    </>
  );
};

export default LandingPage;
