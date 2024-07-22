//frontend/src/components/SpotOneDetails/SpotOneDetails.jsx

import "./SpotOneDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewsSpotThunk } from "../../store/reviews";
import { getSpotsOneThunk } from "../../store/spots";

import ReviewModal from '../ReviewModal'
import ConfirmDeleteModal from "../DeleteReviewModal/DeleteReviewModal";
// import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";     ////////////////////////////



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


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);  ////////////////////////////
    const [showDeleteModal, setShowDeleteModal] = useState(false);  ////////////////////////////
    const [selectedReview, setSelectedReview] = useState(null);     ////////////////////////////

    useEffect(() => {
        dispatch(getReviewsSpotThunk(spotId))
        dispatch(getSpotsOneThunk(spotId))
    }, [dispatch, spotId, isModalOpen, showUpdateModal, showDeleteModal]);

    const { name, city, state, country, description } = spotsObj || {}; //const { name, city, state, country, address } = spotsObj || {};
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

    // const _handleUpdateBtn = (e, review) => { //const handleUpdateBtn = (e, review) => {
    //     e.preventDefault();
    //     setSelectedReview(review);
    //     setShowUpdateModal(true);
    // }

    const handleDeleteBtn = (e, review) => {
        e.preventDefault();
        setSelectedReview(review);
        setShowDeleteModal(true);
    }

    const handleNewReviewBtn = () => {
        setIsModalOpen(true)
    }

    const handleUpdateBtn = (e, review) => { //const handleUpdateBtn = (e, review) => {
        setSelectedReview(review);
        setShowUpdateModal(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        // setSelectedReview(null)
    };

    const isLoggedIn = () => {
        return sessionObject?.user
    }

    const getReviewsStr = (num) => {
        if (!num) return
        if (num === 0) return "New"
        if (num === 1) return "1 review"
        return `${num} reviews`
    }

    const isSameOwnerSpot = () => {
        return Owner?.id === sessionObject?.user?.id;
    };

    const isSameOwnerReview = (review) => {
        return review?.userId === sessionObject?.user?.id;
    }

    const hasReviewAlready = () => {
        if (reviewsArr && sessionObject) {
            return reviewsArr.some(e => {
                const isMatch = e?.userId === sessionObject?.user?.id;
                return isMatch;
            });
        }
        return false;
    };

    const handleReserveBtn = () => {
        alert('Feature coming soon')
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
                    <p> {description} </p>
                </div>
                <div className="gridRow reserveBtnDiv">

                    <div className="xFlex">
                        <div className="xFlex"><span className="priceFont">{`$${price?.toFixed(2)}`}</span>{"\u00A0"}night </div>
                        <div
                            className="xFlex"
                        >
                            &#9733; {avgStarRating === 0 ? 'New' : avgStarRating?.toFixed(1)}
                            {reviewsArr.length > 0 && <span> &nbsp; &#183; &nbsp;{getReviewsStr(reviewsArr.length)} </span>}
                        </div>
                    </div>

                    <button
                        className="reserveBtn clickable"
                        onClick={handleReserveBtn}
                    >
                        Reserve
                    </button>
                </div>
            </div>


            <hr />

            <h2>

                &#9733; {avgStarRating === 0 ? 'New' : avgStarRating?.toFixed(1)}
                {reviewsArr.length > 0 && <span> &nbsp; &#183; &nbsp;{reviewsArr.length} reviews </span>}
            </h2>
            {!hasReviewAlready() && isLoggedIn() && !isSameOwnerSpot() && <button className="greyButton clickable" onClick={handleNewReviewBtn}>Post Your Review </button>}
            {isLoggedIn() && !isSameOwnerSpot() && reviewsArr.length === 0 && <p>Be the first to post a review!</p>}

            {
                reviewsArr.map((review, idx) => (
                    <div key={`${review.id}-${idx}-review`} >
                        <br />
                        <h4>{review?.User?.firstName} {review?.User?.lastName}</h4>
                        <h5 style={({ color: 'gray' })}>{formatDateString(review.updatedAt)}</h5>
                        <p>{review.review}</p>
                        {isLoggedIn() && isSameOwnerReview(review) && <div>
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
                        </div>}
                    </div>
                ))
            }

            {isModalOpen && (
                <ReviewModal
                    onClose={handleModalClose}
                    onSubmit={handleNewReviewBtn}
                    id={spotsObj.id}
                    reviewExists={hasReviewAlready()}
                    spotsObj={spotsObj}
                />
            )}
            {showDeleteModal && (
                <ConfirmDeleteModal
                    review={selectedReview}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
            {showUpdateModal && (
                <ReviewModal
                    onClose={handleModalClose}
                    onSubmit={handleNewReviewBtn}
                    id={spotsObj.id}
                    reviewExists={hasReviewAlready()}
                    spotsObj={spotsObj}
                    selectedReview={selectedReview}
                />
            )}
        </div>
    );
}

export default SpotOneDetails;


/*
 {showUpdateModal && (
                <UpdateReviewModal
                    review={selectedReview}
                    onClose={() => setShowUpdateModal(false)}
                />
)}
*/