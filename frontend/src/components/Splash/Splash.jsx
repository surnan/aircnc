//frontend/src/components/Splash/Splash.jsx
import "./Splash.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpotsAllThunk } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";

function Splash() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const spotsArr = useSelector(state => state.spots.allSpots)

  const handleSpotClick = (e, spot) => {
    e.preventDefault();
    e.stopPropagation();
    nav(`/spots/${spot.id}`)
  }

  useEffect(() => {
    dispatch(getSpotsAllThunk())
  }, [dispatch]);


  return (
    <div className="splashSpotGrid">
      {
        spotsArr.map((spot, idx) => (
          <div 
          key={`${spot.id}-${idx}-spot`} 
          className="clickable spotSquare"
          onClick={ e => handleSpotClick(e, spot)}
          >
            <SpotCard spot={spot} />
          </div>
        ))
      }
    </div>
  );
}
export default Splash;


