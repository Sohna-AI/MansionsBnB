import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';
import { useModal } from '../../context/Modal';

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  return (
    <>
      <div className="login-page-container">
        <div className="login-page">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit} className="form">
            <div className="login-form-group">
              <label className="login-sub-title">Username or Email</label>
              <input
                className="login-form-style"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>
            <div className="login-form-group">
              <label className="login-sub-title">Password</label>
              <input
                className="login-form-style"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.credential && <p>{errors.credential}</p>}
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginFormModal;
