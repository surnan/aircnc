//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotCard.css";

function SpotCard({ spot }) {
  const { city, state, avgRating, price, name, previewImage } = spot

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
