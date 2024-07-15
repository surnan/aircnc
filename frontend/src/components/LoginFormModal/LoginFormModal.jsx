// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false)

  // useEffect(()=>{
  //   const newErrors = {}

  //   setErrors(newErrors)
  // })




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
      <h1 className="center">Log In</h1>
      <form onSubmit={handleSubmit} className='verticalFlexContainer'>
        <input
          type="text"
          placeholder=' Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          className='formInput'
          required
        />

        <p style={{ color: 'red' }}>The provided credentials were invalid</p>

        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="formInput"
        />
        {errors.credential && (<p>{errors.credential}</p>)}
        <button
          className="loginButton"
          type="submit"
        >
          Log In
        </button>
        <button
          className="demoButton"
          onClick={(e) => demoLogin(e)}
        >
          Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;