import { FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import SignupFormModal from '../SignupFormPage/SignupFormModal';
import LoginFormModal from '../LoginFormPage/LoginFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';
import { NavLink, useNavigate } from 'react-router-dom';

const ProfileButton = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/');
    closeMenu();
  };

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');
  return (
    <>
      <div className="profile-button-container">
        <button onClick={toggleMenu} className="profile-button">
          <FaUser className="avatar" />
        </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li className="profile-dropdown-user-info-container">
                <div className="profile-dropdown-user-info">
                  <span className="profile-dropdown-username">Hello, {user.username}</span>
                  <div className="profile-dropdown-email-container">
                    <div className='profile-dropdown-email'>
                    {user.email}
                    </div>
                  </div>
                </div>
              </li>
              <li className="profile-dropdown-manage-spots-container">
                <NavLink to="/spots/current" className='profile-dropdown-manage-spots' onClick={closeMenu} style={{ textDecoration: 'none' }}>
                  Manage Spots
                </NavLink>
              </li>
              <li>
                <div className="logout-button-container">
                  <button onClick={logout} className="logout-button-dropdown">
                    Log Out
                  </button>
                </div>
              </li>
            </>
          ) : (
            <li>
              <div className="login-signup-button-container">
                <div className="login-button-container">
                  <button className="login-button-dropdown">
                    <OpenModalMenuItem
                      itemText="Log In"
                      modalComponent={<LoginFormModal />}
                      onItemClick={closeMenu}
                    />
                  </button>
                </div>
                <div className="signup-button-container">
                  <button className="signup-button-dropdown">
                    <OpenModalMenuItem
                      itemText="Sign Up"
                      modalComponent={<SignupFormModal navigate={navigate} />}
                      onItemClick={closeMenu}
                    />
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default ProfileButton;
