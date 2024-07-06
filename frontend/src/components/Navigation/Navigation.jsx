import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const nav = useNavigate();

  const CreateSpotButton = () => {
    return (
      <button
        clasName="clickable"
        onclick={() => nav("/spots/new")}
        id="create-spot"
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
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;

/*
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
  */