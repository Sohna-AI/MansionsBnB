import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import SignupFormModal from '../SignupFormPage/SignupFormModal';
import LoginFormModal from '../LoginFormPage/LoginFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';

const ProfileButton = ({ user }) => {
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
    closeMenu();
  };

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');
  return (
    <>
      <div className="profile-button-container">
        <button onClick={toggleMenu} className="profile-button">
          <FaUserCircle />
        </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li>{user.username}</li>
              <li>
                {user.firstName} {user.lastName}
              </li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <button className="login-button-dropdown">
                <OpenModalMenuItem
                  itemText="Log In"
                  modalComponent={<LoginFormModal />}
                  onItemClick={closeMenu}
                />
              </button>
              <br />
              <button className="signup-button-dropdown">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  onItemClick={closeMenu}
                />
              </button>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default ProfileButton;
