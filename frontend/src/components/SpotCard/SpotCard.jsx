//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotCard.css";
import { useNavigate } from "react-router-dom";


function SpotCard({ spot }) {
    const nav = useNavigate();
    const { id, city, state, avgRating, price, name, previewImage } = spot

    const starPath = "assets/icons/star.png"
    const starPath2 = "https://via.placeholder.com/300.jpg"


    return (
        <div className="container">
          <div className="spotCard">
            <img key={id} className="clickable spotPreviewImage" src={previewImage} alt="House" />
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

export default SpotCard;
