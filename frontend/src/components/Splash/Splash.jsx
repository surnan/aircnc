//frontend/src/components/SpotCard/SpotCard.jsx
import "./Splash.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpotsAllThunk } from "../../store/spots";

function Splash() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const spotsArr = useSelector(state => state.spots.allSpots)
  const [isLoaded, setIsLoaded] = useState(false);



  useEffect(() => {
    dispatch(getSpotsAllThunk())
  }, [dispatch]);


  return (
    <div>
      {spotsArr.map((spot, idx)=> (
        <p>{spot.name}</p>
      ))}
    </div>
  );
}

export default Splash;
