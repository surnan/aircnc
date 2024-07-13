//frontend/src/components/viewAllSpots/ViewAllSpots.jsx

import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewsSpotThunk } from "../../store/reviews";
import { getSpotsOneThunk } from "../../store/spots";
import { restoreUser } from "../../store/session";
// import { restoreUserThunk } from "../../store/session";

function SpotOneDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    const nav = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [spotsLoaded, setSpotsLoaded] = useState(false);

    const reviewsArr = useSelector(state => state.reviews.allReviews)
    const spotsObj = useSelector(state => state.spots.single)

    useEffect(() => {
        dispatch(getReviewsSpotThunk(spotId))
        dispatch(getSpotsOneThunk(spotId))
    }, [dispatch, spotId]);

    let owner;

    return (
        <div>
            <p>SpotDetails Page with id={spotId}</p>
            <br/>
            {
                reviewsArr.map((review, idx) => (
                    <div
                        key={`${review.id}-${idx}-review`}
                    >
                        <h4>{review.review}</h4>
                    </div>
                ))
            }
            <br />
            <br />
            {/* 
            <div>
                <h2>Spot Details:</h2>
                {
                    Object.entries(spotsObj).map(([key, value]) => (
                        <>
                            <br />
                            <p>hello {key}</p>
                        </>
                        // <div key={key}>
                        //     <strong>{key}:</strong> {value}
                        // </div>
                    ))
                }
            </div> */}

            <div>
                <h2>Spot Details:</h2>
                {
                    <>
                        <p>1 - {spotsObj["address"]}</p>
                        <p>2 - {spotsObj["city"]}</p>
                        <p>3 - {spotsObj.Owner["firstName"]}</p>

                    </>
                }
            </div>
        </div>
    );

}

export default SpotOneDetails;