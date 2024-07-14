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

    const { name, city, state, country, address } = spotsObj || {};
    const { avStarRating, price, Owner, SpotImages } = spotsObj || {};

    let previewURL;
    let nonPreviewURL = []

    if (spotsObj?.SpotImages) {
        console.log('SpotImages = ', SpotImages)

        for (let img of SpotImages) {
            if (img.preview) {
                previewURL = img.url;
                console.log("##### previewURL = ", previewURL)
            } else {
                nonPreviewURL.push(img.url)
            }
        }

        console.log('a')


        for (let i = 0; i < 5; i++) {
            console.log('b ... nonPreviewURL', nonPreviewURL)
            if (!SpotImages[i]) {
                console.log('c')
                nonPreviewURL.push(previewURL)
            }
        }

        







    }


    return (
        <div>
            <h1>{name}</h1>
            <h3>
                {city}, {"\u00A0"}
                {state}, {"\u00A0"}
                {country}
            </h3>

            <div className="container">
                <div className="box">
                    <img src={previewURL} alt={`Spot 111`} />
                </div>

                {nonPreviewURL.map((url, idx) => (
                    <div dey={`${url}-${idx}`} className="box">
                        <img src={nonPreviewURL[idx]} alt={`Spot 111`} />
                    </div>
                ))}
            </div>


            <h2>
                Hosted by {"\u00A0"}
                {Owner && Owner.firstName} {Owner && Owner.lastName}
            </h2>




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


        </div>
    );
}

export default SpotOneDetails;








/*

*/