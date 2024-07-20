//frontend/src/components/ReviewsOwned/ReviewsOwned.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsUserThunk } from "../../store/reviews";
import { getSpotsAllThunk } from "../../store/spots";
import "./ReviewsOwned.css"



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

const handleUpdateBtn = () => {
    console.log('click handleUpdateBtn')
}

const handleDeleteBtn = () => {
    console.log('click handleUpdateBtn')
}

function ReviewsOwned() {
    const dispatch = useDispatch();

    const reviewsArr = useSelector(state => state.reviews.allReviews)
    const spotsObj= useSelector(state => state.spots)
    
    

    useEffect(() => {
        dispatch(getReviewsUserThunk())
        dispatch(getSpotsAllThunk())
    }, [dispatch]);


    return (
        <>
            <h1 className="reviewTitle">Manage Reviews</h1>
            {
                 reviewsArr.map((review, idx) => (
                    <div key={`${review.id}-${idx}-review`} >
                        <br />
                        <h4>{spotsObj.byId[review.spotId].name}</h4>
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
                        <br/>
                    </div>
                ))
            }
        </>
    )
}

export default ReviewsOwned;


