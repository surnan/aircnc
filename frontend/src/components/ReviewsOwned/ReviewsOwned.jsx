//frontend/src/components/ReviewsOwned/ReviewsOwned.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsUserThunk } from "../../store/reviews";
import { getSpotsAllThunk } from "../../store/spots";
import "./ReviewsOwned.css"
// import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";     ////////////////////////////
import ConfirmDeleteModal from "../DeleteReviewModal/DeleteReviewModal";    ////////////////////////////
import ReviewModal from '../ReviewModal'


function formatDateString(dateString) {
    const date = new Date(dateString);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
}

function ReviewsOwned() {
    const dispatch = useDispatch();
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);  ////////////////////////////
    const [showDeleteModal, setShowDeleteModal] = useState(false);  ////////////////////////////
    const [selectedReview, setSelectedReview] = useState(null);     ////////////////////////////
    const reviewsArr = useSelector(state => state.reviews.allReviews)
    const spotsObj = useSelector(state => state.spots)

    useEffect(() => {
        dispatch(getReviewsUserThunk())
        dispatch(getSpotsAllThunk())
    }, [dispatch]);

    const handleDeleteBtn = (e, review) => {
        e.preventDefault();
        setSelectedReview(review);
        setShowDeleteModal(true);
    }

    const handleUpdateBtn = (e, review) => { //const handleUpdateBtn = (e, review) => {
        setSelectedReview(review);
        setShowUpdateModal(true);
    }

    const handleModalClose = () => {
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        // setIsModalOpen(false);
        // setSelectedReview(null)
    };

    return (
        <>
            <h1 className="reviewTitle">Manage Reviews</h1>
            {
                reviewsArr.map((review, idx) => (
                    <div key={`${review.id}-${idx}-review`} >
                        <br />
                        <h4>{spotsObj.byId[review.spotId]?.name}</h4>
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
                        <br />
                    </div>
                ))
            }
            {showUpdateModal && (
                <ReviewModal
                    onClose={handleModalClose}
                    // onSubmit={handleNewReviewBtn}
                    onSubmit={handleUpdateBtn}
                    id={spotsObj.id}
                    reviewExists={false}
                    spotsObj={spotsObj?.byId[selectedReview?.spotId]}
                    selectedReview={selectedReview}
                />
            )}
            {showDeleteModal && (
                <ConfirmDeleteModal
                    review={selectedReview}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    )
}

export default ReviewsOwned;