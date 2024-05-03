import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionsLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
    </li>
  ) : (
    <>
      <li>
        <NavLink
          className="nav"
          to="/login"
          style={({ isActive }) =>
            isActive
              ? {
                  color: '#fff',
                  background: '#e99f4c',
                }
              : { color: '#fff', background: '#de5499' }
          }
        >
          Log In
        </NavLink>
      </li>
      <li>
        <NavLink
          className="nav"
          to="/signup"
          style={({ isActive }) =>
            isActive
              ? {
                  color: '#fff',
                  background: '#e99f4c',
                }
              : { color: '#fff', background: '#de5499' }
          }
        >
          Sign Up
        </NavLink>
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
