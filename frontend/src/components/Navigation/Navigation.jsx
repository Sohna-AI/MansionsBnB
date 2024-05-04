import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormPage/LoginFormModal';
import SignupFormModal from '../SignupFormPage/SignupFormModal';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionsLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
    </li>
  ) : (
    <>
      <li>
        <OpenModalButton  buttonText="Log In" modalComponent={<LoginFormModal />} />
      </li>
      <li>
        <OpenModalButton buttonText="Sign Up" modalComponent={<SignupFormModal />} />
      </li>
    </>
  );

  return (
    <div className="nav-container">
      <ul className="nav-links">
        <li>
          <NavLink
            className="nav"
            to="/"
            style={({ isActive }) =>
              isActive
                ? {
                    color: '#fff',
                    background: '#e99f4c',
                  }
                : { color: '#fff', background: '#de5499' }
            }
          >
            Home
          </NavLink>
        </li>
        {isLoaded && sessionsLinks}
      </ul>
    </div>
  );
};

export default Navigation;
