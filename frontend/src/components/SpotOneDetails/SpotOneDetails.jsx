//frontend/src/components/viewAllSpots/ViewAllSpots.jsx

import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReviewsSpotThunk } from "../../store/reviews";
import { getSpotsOneThunk } from "../../store/spots";


function formatDateString(dateString) {
    const date = new Date(dateString);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Get the month and year
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format the date as "Month Year"
    return `${month} ${year}`;
}

function SpotOneDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams()

    const reviewsArr = useSelector(state => state.reviews.allReviews)
    const spotsObj = useSelector(state => state.spots.single)
    const sessionObject = useSelector(state => state.session)



    useEffect(() => {
        dispatch(getReviewsSpotThunk(spotId))
        dispatch(getSpotsOneThunk(spotId))
    }, [dispatch, spotId]);

    const { name, city, state, country } = spotsObj || {}; //const { name, city, state, country, address } = spotsObj || {};
    const { avgStarRating, price, Owner, SpotImages } = spotsObj || {};

    let previewURL;
    let nonPreviewURL = []

    if (spotsObj?.SpotImages) {

        for (let img of SpotImages) {
            if (img.preview) {
                previewURL = img.url;
            } else {
                nonPreviewURL.push(img.url)
            }
        }

        for (let i = 0; i < 5; i++) {
            if (!SpotImages[i]) {
                nonPreviewURL.push(previewURL)
            }
        }
    }

    const handleUpdateBtn = (e) => { //const handleUpdateBtn = (e, review) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('clicked Update Button')
        // nav(`/spots/${spot.id}/edit`)
    }

    const handleDeleteBtn = (e) => { //const handleDeleteBtn = (e, review) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('clicked Delete Button')
        // dispatch(deleteSpotOneThunk(spot.id))
    }

    const handleNewReviewBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('clicked handleNewReviewBtn Button')
    }


    const isSameOwner = () => {
        return Owner?.id === sessionObject?.user?.id;
    };

    const getReviewsStr = (num) =>{
        if (!num) return
        if (num === 0) return "New"
        if (num === 1) return "1 review"
        return `${num} reviews`
    }


    return (
        <div>
            <h1>{name}</h1>
            <h2> Same Owner = {isSameOwner() ? 'Yes' : 'No'}</h2>
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
                    <div key={`${url}-${idx}`} className="box">
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

                    <div className="xFlex">
                        <div className="xFlex"><span className="priceFont">{`$${price?.toFixed(2)}`}</span>{"\u00A0"}night </div>
                        <div
                            className="xFlex"
                        >
                            &#9733; {avgStarRating === 0 ? 'New' : avgStarRating?.toFixed(1)}
                            {/* {reviewsArr.length > 0 && <span> &nbsp; &#183; &nbsp;{reviewsArr.length} reviews </span>} */}
                            {reviewsArr.length > 0 && <span> &nbsp; &#183; &nbsp;{getReviewsStr(reviewsArr.length)} </span>}
                        </div>
                    </div>

                    <button className="reserveBtn"> Reserve </button>
                </div>
            </div>


            <hr />

            <h2>
                
                  &#9733; {avgStarRating === 0 ? 'New' : avgStarRating?.toFixed(1)}
                {reviewsArr.length > 0 && <span> &nbsp; &#183; &nbsp;{reviewsArr.length} reviews </span>}
            </h2>
            {!isSameOwner() && <button className="greyButton clickable" onClick={handleNewReviewBtn}>Post Your Review </button>}
            {!isSameOwner() && reviewsArr.length === 0 && <p>Be the first to post a review!</p>}

            {
                reviewsArr.map((review, idx) => (
                    <div key={`${review.id}-${idx}-review`} >
                        <br />
                        <h4>{review.User.firstName} {review.User.lastName}</h4>
                        <h5 style={({ color: 'gray' })}>{formatDateString(review.updatedAt)}</h5>
                        <p>{review.review}</p>
                        <div>
                            <button
                                className="greyButton clickable"
                                onClick={e => handleUpdateBtn(e, review)}
                            >
                                Update
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button
                                className="greyButton clickable"
                                onClick={e => handleDeleteBtn(e, review)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default SpotOneDetails;
