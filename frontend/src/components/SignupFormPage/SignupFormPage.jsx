import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupFormPage.css';

const SignupFormPage = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: 'Confirm password field must be the same the password field',
    });
  };

  return (
    <>
      <div className="signup-page-container">
        <div className="signup-page">
          <h1 className="signup-title">Sign Up</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form-group">
              <label className="signup-sub-title">
                Email
                <br />
                <input
                  className="signup-form-style"
                  type="email"
                  placeholder="Provide a email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div className="signup-form-group">
              <label className="signup-sub-title">
                Username
                <br />
                <input
                  className="signup-form-style"
                  type="text"
                  placeholder="Provide a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              {errors.username && <p>{errors.username}</p>}
            </div>
            <div className="signup-form-group">
              <label className="signup-sub-title">
                First Name
                <br />
                <input
                  className="signup-form-style"
                  type="text"
                  placeholder="Provide your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
              {errors.firstName && <p>{errors.firstName}</p>}
            </div>
            <div className="signup-form-group">
              <label className="signup-sub-title">
                Last Name
                <br />
                <input
                  className="signup-form-style"
                  type="text"
                  placeholder="Provide your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
              {errors.lastName && <p>{errors.lastName}</p>}
            </div>
            <div className="signup-form-group">
              <label className="signup-sub-title">
                Password
                <br />
                <input
                  className="signup-form-style"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {errors.password && <p>{errors.password}</p>}
            </div>
            <div className="signup-form-group">
              <label className="signup-sub-title">
                Confirm Password
                <br />
                <input
                  className="signup-form-style"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupFormPage;
