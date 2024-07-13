//frontend/src/components/viewAllSpots/ViewAllSpots.jsx

import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewsSpotThunk } from "../../store/reviews";
import { getSpotsOneThunk } from "../../store/spots";
// import { restoreUser } from "../../store/session";

function SpotOneDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    
    const reviewsArr = useSelector(state => state.reviews.allReviews)
    const spotsObj = useSelector(state => state.spots.single)
    

    // const nav = useNavigate();
    // const [isLoaded, setIsLoaded] = useState(false);
    // const [spotsLoaded, setSpotsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getReviewsSpotThunk(spotId))
        dispatch(getSpotsOneThunk(spotId))
    }, [dispatch, spotId]);


    return (
        <div>
            <p>SpotDetails Page with id={spotId}</p>
            <br />
            {
                reviewsArr.map((review, idx) => (
                    <div
                        key={`${review.id}-${idx}-review`}
                    >
                        <h4>review: {review.review}</h4>
                    </div>
                ))
            }
            <br />
            <br />


            <div>
                <h2>Spot Details:</h2>
                {spotsObj && spotsObj.Owner ? (
                    <>
                        <p>address - {spotsObj.address}</p>
                        <p>city - {spotsObj.city}</p>
                        <p>Owner.firstName = {spotsObj.Owner.firstName}</p>
                    </>
                ) : (
                    <p>Loading spot details...</p>
                )}
            </div>

            <br />

            <div>
                {spotsObj && spotsObj.SpotImages ? (
                    spotsObj.SpotImages.map((image, idx) => (
                        <div key={`${image.id}-${idx}-image`}>
                            <br />
                            <hr/>
                            <br />
                            <p>{`preview = ${image.preview}`}</p>
                            <img src={image.url} alt={`Spot ${idx}`} />
                        </div>
                    ))
                ) : (
                    <p>Loading images...</p>
                )}
                <hr/>
            </div>
        </div>
    );
}

export default SpotOneDetails;