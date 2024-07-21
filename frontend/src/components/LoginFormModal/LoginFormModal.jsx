// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [showError, setShowError] = useState(false);


  const isButtonDisabled = credential.length === 0 || password.length === 0

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

  useEffect(()=>{
    setShowError(false)
  }, [credential, password])


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        
        if (data?.message === 'Invalid credentials'){
          setShowError(true)
        }

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  

  return (
    <>
      <h1 className="center">Log In</h1>
      <form onSubmit={handleSubmit} className='verticalFlexContainer'>
      {showError &&  <p style={{ color: 'red', padding: '1rem' }}>The provided credentials were invalid</p>}
        <input
          type="text"
          placeholder=' Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          className='formInput'
          required
        />


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
          className={`loginButton ${!isButtonDisabled && 'enabled'}` }
          disabled = {isButtonDisabled}
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