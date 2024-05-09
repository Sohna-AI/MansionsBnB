import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../../../images/logo.png';
import './Navigation.css';
import CreateSpot from '../CreateSpot/CreateSpot';
import { useEffect, useState } from 'react';

const Navigation = ({ isLoaded }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser === null) {
      setIsLoggedIn(false);
    } else setIsLoggedIn(true);
  }, [sessionUser]);

  return (
    <div className="nav-container">
      <ul className="nav-links">
        <li>
          <NavLink to="/">
            <img src={logo} className="logo-image" />
          </NavLink>
        </li>
        {isLoggedIn && (
          <li className='create-spot'>
            <NavLink to="/spots/new">
              <CreateSpot />
            </NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
