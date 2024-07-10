//frontend/src/components/SpotDetails/SpotDetails.jsx
import "./SpotCard.css";
import { useNavigate } from "react-router-dom";


function SpotDetails({ spot }) {
  const nav = useNavigate();
  const { id, city, state, avgRating, price, name, previewImage } = spot

  const starPath = "assets/icons/star.png"


  return (
    <div className="container">
      <div className="spotCard">

        <img key={`${name}-${id}`} className="spotPreviewImage clickable" src={previewImage} alt="House" />
        <span className="tooltip">{name}</span>
        <div className="spotCardBtm">
          <div className="spotCardBtm left">
            <p>{city}, {state}</p>
          </div>
          <div className="spotCardBtm right">
            <img key={id} className="starIcon" src={starPath} alt="star" />
            {avgRating}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetails;
