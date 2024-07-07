import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const nav = useNavigate();

  const handleCreateSpotButton = () => {
    console.log('button clicked')
    nav("/spots/new")
  }

  const CreateSpotButton = () => {
    return (
      <button
        // className="clickable createNewSpot"
        className="createNewSpot"
        id="create-spot"
        onClick={handleCreateSpotButton}
      >
        Create New Spot
      </button>
    )
  }

  return (
    <nav id="navigation">
      <img
        src="/logo5.png"
        className="clickable"
        id="logo"
        alt="AirCnC Logo"
        onClick={() => nav("/")}
      />

      <div id="right-container">
        {sessionUser && <CreateSpotButton />}
      </div>
      <div id="right-container">
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav >
  );
}

export default Navigation;