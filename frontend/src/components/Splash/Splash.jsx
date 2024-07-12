//frontend/src/components/SpotCard/SpotCard.jsx
import "./Splash.css";

import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpotsAllThunk } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";

function Splash() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const spotsArr = useSelector(state => state.spots.allSpots)
  const [isLoaded, setIsLoaded] = useState(false);



  useEffect(() => {
    dispatch(getSpotsAllThunk())
  }, [dispatch]);


  return (
    <div className="grid-container">
      {
        spotsArr.map((spot, idx) => (
          <div key={`${spot.id}-${idx}-spot`}>
            <SpotCard spot={spot} />
          </div>
        ))
      }
    </div>
  );
}
export default Splash;


