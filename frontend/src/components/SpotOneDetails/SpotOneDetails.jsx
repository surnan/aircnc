//frontend/src/components/viewAllSpots/ViewAllSpots.jsx
import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getSpotsOneThunk } from "../../store/spots";


function SpotOneDetails() {

    const {spotId} = useParams()

    console.log(`spotId = ${spotId}`)


    
    return (
        <div>
            <p>SpotDetails Page with id={spotId}</p>
        </div>
    );

}

export default SpotOneDetails;


