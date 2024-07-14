//frontend/src/components/viewAllSpots/ViewAllSpots.jsx
import "./ViewAllSpots.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import SpotCard from "../SpotCard";

function ViewAllSpots() {

    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots);

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    const handleClick = ()=> {
        console.log("click happened")
    }

    const validateSpot = (spot) => {
        const properties = [
          "id",
          "name",
          "city",
          "state",
          "previewImage",
          "price",
          "avgRating",
        ];
        return properties.every((prop) => spot[prop] !== undefined);
      };

      
    return (
        <div className="grid-container">
            {spotsArr.map((spot, idx) => (
                <div key={`spotCard-${idx}`} className="spotCard clickable">
                    <SpotCard spot={spot}/>
                </div>
            ))}
        </div>
    );

}

export default ViewAllSpots;