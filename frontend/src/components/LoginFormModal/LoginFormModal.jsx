// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();



  const demoLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' })).then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data?.errors) setErrors(data.errors);
        }
      );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form
        onSubmit={handleSubmit}
        className='verticalFlexContainer'
      >

        <input
          type="text"
          placeholder=' Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit">Log In</button>

        <button onClick={(e) => demoLogin(e)}>log in as demo user</button>
      </form>
    </>
  );
}

export default LoginFormModal;