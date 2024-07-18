//frontend/src/components/Navigation/ProfileButton.jsx

import './ProfileButton.css'
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { useNavigate, useParams } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const nav = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };


  const handleManageSpots = ()=>{
    nav(`/spots/current`);
  }

  const ulClassName = "profile-dropdown" + (showMenu ? " show" : " hidden");

  return (
    <nav>

      <div
        id='PROFILE-RIGHT-CONTAINER'
        className='clickable'
        onClick={toggleMenu}
      >
        <FaBars className="fa-icon" />
        <FaUserCircle className="fa-icon" />
      </div>


      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className='leftPad'>Hello, {user.username}</li>
            <li className='leftPad'>{user.email}</li>
            <li
              className='boxIt clickable leftPad'
              onClick={handleManageSpots}
            >
              Manage Spots
            </li>
            <li
              className='liFlex'>
              <button
                className='logoutBtn clickable'
                onClick={logout}
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>


    </nav >
  );
}

export default ProfileButton;