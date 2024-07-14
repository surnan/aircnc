//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotCard.css";
import { useNavigate } from "react-router-dom";


function SpotCard({ spot }) {
  const nav = useNavigate();
  const { id, city, state, avgRating, price, name, previewImage } = spot

  const starPath = "assets/icons/star.png"


  return (
    <div className="spotCard">
      <img className="spotPreviewImage" src={previewImage} alt="House" />
      <span className="tooltip">{name}</span>


      <div className="spotCardBtm">

        <div className="spotCardBtm left">
          <p>{city}, {state}</p>
        </div>


        <div className="spotCardBtm right">
          <span>&#9733;</span>
          {avgRating}
        </div>

      </div>


      <p><strong>{`$${price}`}</strong> night</p>
    </div>
  )
}

export default SpotCard;
