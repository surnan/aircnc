import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const nav = useNavigate();


  const handleCreateSpotButton = () => {
    nav("/spots/new")
  }

  const CreateSpotButton = () => {
    return (
      <button
        className="createNewSpot"
        id="create-spot"
        onClick={handleCreateSpotButton}
      >
        Create a New Spot
      </button>
    )
  }


  const handleLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    nav("/")
  }

  return (
    <nav id="navigation">
      <img
        src="/logo.png"
        id="logo"
        alt="AirCnC Logo"
        className='clickable'
        onClick={handleLogo}
      />

      <div id="navRightContainer">
        {sessionUser && <CreateSpotButton />}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>

    </nav >
  );
}

export default Navigation;