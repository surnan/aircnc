////frontend/src/components/SignupFormModal/SignupFormModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isButtonDisabled = () => (
   email.length === 0 || username.length === 0 || firstName.length === 0 || lastName.length === 0 || password.length === 0 || confirmPassword.length === 0
  )

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
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
      <form
        className='signUpFlex'
      >
        <input
          type="text"
          value={email}
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className='error'>{errors.email}</p>}

        <input
          type="text"
          value={username}
          placeholder='Username'
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className='error'>{errors.username}</p>}

        <input
          type="text"
          value={firstName}
          placeholder='First Name'
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className='error'>{errors.firstName}</p>}

        <input
          type="text"
          value={lastName}
          placeholder='Last Name'
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className='error'>{errors.lastName}</p>}

        <input
          type="password"
          value={password}
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className='error'>{errors.password}</p>}

        <input
          type="password"
          value={confirmPassword}
          placeholder='Confirm Password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className='error'>{errors.confirmPassword}</p>

        )}
        <button
          type="submit"
          className= {`signUpBtn ${!isButtonDisabled() && 'enabled'}`}
          disabled = {isButtonDisabled()}
          onClick={handleSubmit}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

