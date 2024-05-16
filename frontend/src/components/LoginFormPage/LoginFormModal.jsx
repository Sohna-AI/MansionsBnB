import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import './LoginForm.css';
import { useModal } from '../../context/Modal';

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (credential.length < 4) {
      setCredentialError('Username must be at least 4 characters');
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    }

    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  const handleDemoLogin = async () => {
    try {
      await dispatch(sessionActions.loginAsDemoUser()).then(closeModal);
    } catch (error) {
      console.error('Demo Login failed:', error);
    }
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
                placeholder="Enter your username or email"
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>
            {credentialError && <p>{credentialError}</p>}
            <div className="login-form-group">
              <label className="login-sub-title">Password</label>
              <input
                className="login-form-style"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p>{passwordError}</p>}
            </div>
            {errors.credential && <p>{errors.credential}</p>}
            <div className="login-form-button-container">
              <button type="submit" className="login-button" disabled={!credential || !password}>
                Log In
              </button>
            </div>
          </form>
          <div className="login-button-demo-user">
            <button className="login-button" onClick={handleDemoLogin}>
              Login as Demo User
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginFormModal;
