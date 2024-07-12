//frontend/src/components/viewAllSpots/ViewAllSpots.jsx
import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";

import React from "react";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// import { getSpotsOneThunk } from "../../store/spots";
import { getReviewsSpotThunk } from "../../store/reviews";


function SpotOneDetails() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    // const spotsArr = useSelector(state => state.spots.allSpots)
    // const spotOneObj = useSelector(state => state.reviews.allReviews)
    const reviewsArr = useSelector(state => state.reviews.allReviews)


    const { spotId } = useParams()
    console.log(`spotId = ${spotId}`)

    console.log('reviewsArr', reviewsArr)

    useEffect(() => {
        dispatch(getReviewsSpotThunk(spotId))
    }, [dispatch]);



    return (
        <div>
            <p>SpotDetails Page with id={spotId}</p>
        </div>
    );

}

export default SpotOneDetails;


