//frontend/src/components/viewAllSpots/ViewAllSpots.jsx

import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewsSpotThunk } from "../../store/reviews";
import { getSpotsOneThunk } from "../../store/spots";
// import { restoreUser } from "../../store/session";
const starPath = "assets/icons/star.png"

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
    const { avgStarRating, price, Owner, SpotImages } = spotsObj || {};

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




            <div className="gridCol middlePanel">
                <div className="gridRow">
                    <h2>
                        Hosted by {"\u00A0"}
                        {Owner && Owner.firstName} {Owner && Owner.lastName}
                    </h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum reprehenderit explicabo esse eius distinctio quisquam fuga ratione, exercitationem alias deleniti veniam enim sunt id provident ab nesciunt vero nemo debitis.
                        Quo, molestias possimus voluptas consequuntur accusamus id necessitatibus! Corporis rem perferendis, amet quisquam culpa voluptates commodi alias expedita aliquam reiciendis vel voluptatem ducimus labore sequi, cum, quae accusantium voluptate officiis.
                        Quos quo odio voluptates dolores saepe sunt, fugit at dolor pariatur commodi debitis ut facilis officiis similique ratione, rem tenetur, nostrum obcaecati placeat dolorum suscipit. Quibusdam aperiam culpa perferendis nobis!
                        Optio amet quis quod ipsam maiores officiis reiciendis vero. Ullam expedita sint minima laborum laudantium ut unde? Officia sunt repellat quisquam ut, delectus mollitia explicabo minima perferendis aut aliquid ipsa.
                        Maiores sunt labore commodi delectus, atque corporis ipsum suscipit consequatur numquam iure accusantium. Vel quaerat impedit mollitia, rem ut iste deserunt voluptate sunt magni, magnam expedita error repellendus placeat excepturi?
                        Recusandae perferendis dignissimos animi provident neque porro, amet velit asperiores quo saepe nemo. Reprehenderit quo voluptatum nostrum eveniet ad quasi eos quis sit cum aspernatur, minus eligendi error rem ab.
                    </p>
                </div>
                <div className="gridRow reserveBtnDiv">
                    <h4>
                        {`$${price} night`} {"\u00A0"}
                        <img key={spotId} className="starIcon" src={starPath} alt="star" />
                        {"\u00A0"}{"\u00A0"} {avgStarRating}
                        reviews
                    </h4>

                    <button className="reserveBtn">
                        Reserve
                    </button>

                </div>

            </div>


            <br />
            <hr />
            <br />

            <div className="horizontalFlexContainer">
                <img key={spotId} className="starIcon" src={starPath} alt="star" />
                {avgStarRating}
                <p>reviews</p>
            </div>
            {
                reviewsArr.map((review, idx) => (
                    <div key={`${review.id}-${idx}-review`} >
                        <h4>review: {review.review}</h4>
                    </div>
                ))
            }
        </div>
    );
}

export default SpotOneDetails;


/*
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
            */





/*

*/
