//frontend/src/components/viewAllSpots/ViewAllSpots.jsx
import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getSpotsAllThunk } from "../../store/spots";


function SpotOneDetails({spot}) {

    let id = useParams.id
    console.log("id = ", id)

    const dispatch = useDispatch();
    return (
        <div>
            <p>SpotDetails Page with id={id}</p>
        </div>
    );

}

export default SpotOneDetails;


