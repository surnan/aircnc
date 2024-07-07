//frontend/src/components/viewAllSpots/ViewAllSpots.jsx
import "./ViewAllSpots.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";

function ViewAllSpots() {

    const dispatch = useDispatch();
    const spots = useSelector((state)=>state.spots)
    const spotsArr = Object.values(spots);

    useEffect(()=>{
        dispatch(fetchSpots())
    }, [dispatch]);

    console.log('spotsArr', spotsArr)

    return (
        <div>
            {spotsArr.map(spot => (
                <img key={spot.id}  class = "clickable spotPreviewImage" src={spot.previewImage} alt="House" />
            ))}
        </div>
    );

}

export default ViewAllSpots;
