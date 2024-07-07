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

    console.log('spotsArr', spotsArr)

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
        <div>
            {spotsArr.map(spot => (
                <>
                    {/* <img key={spot.id} class="clickable spotPreviewImage" src={spot.previewImage} alt="House" />
                    {spot.city && spot.state ? <p>1 - {spot.city}, {spot.state}</p> : 2 - "New Spot" } */}

                    <SpotCard spot={spot}/>

                </>
            ))}
        </div>
    );

}

export default ViewAllSpots;


/*
    return (
        <div>
            {spotsArr.map(spot => (
                <>
                    <img key={spot.id} class="clickable spotPreviewImage" src={spot.previewImage} alt="House" />
                    {spot.city && spot.state ? <p>1 - {spot.city}, {spot.state}</p> : 2 - "New Spot" }
                </>
            ))}
        </div>
    );
*/