import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useState } from 'react';
import './ProfileButton.css';

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');
  return (
    <>
      <button className="profile-button" onClick={() => setShowMenu(!showMenu)}>
        <FaUserCircle />
      </button>
      <ul className={ulClassName}>
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
};

export default ProfileButton;
