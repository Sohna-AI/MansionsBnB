import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="nav-container">
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className="nav"
            style={({ isActive }) =>
              isActive
                ? {
                    color: '#fff',
                    background: '#e99f4c',
                  }
                : { color: '#fff', background: '#de5499' }
            }
          >
            MansionsBnB
          </NavLink>
        </li>
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
