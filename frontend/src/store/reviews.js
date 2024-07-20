//frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS_SPOT = "reviews/loadReviewsSpot"
const LOAD_REVIEWS_USER = "reviews/loadReviewsUser"
const POST_REVIEW_ONE = "reviews/postReviewOne"


// Actions
const loadReviewsSpot = (data) => {
    return {
        type: LOAD_REVIEWS_SPOT,
        payload: data
    };
};

const loadReviewsUser = (data) => {
    return {
        type: LOAD_REVIEWS_USER,
        payload: data
    };
};

const postReviewOne = (data) => {
    return {
        type: POST_REVIEW_ONE,
        payload: data
    };
};



//Thunks
export const getReviewsSpotThunk = (spotId) => async (dispatch) => {
    // const response = await csrfFetch('/api/spots/:spotId/reviews')
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await response.json();
    dispatch(loadReviewsSpot(data))
    return data
}

export const getReviewsUserThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current')
    const data = await response.json();
    dispatch(loadReviewsUser(data))
    return data
}

export const postReviewThunk = (id, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const reviewData = await res.json();
        await dispatch(createReview(reviewData));
        return reviewData;
    }
}

// State object
const initialState = {
    allReviews: [],
    byId: {},
    currentUser: {}
}

//Reducers
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS_SPOT: {
            let newState = { ...state }
            newState.allReviews = action.payload.Reviews;
            for (let review of action.payload.Reviews) {
                newState.byId[review.id] = review
            }
            return newState;
        }
        case LOAD_REVIEWS_USER: {
            let newState = { ...state }
            return newState
        }
        case POST_REVIEW_ONE: {
            newState = { ...state }
            newState.allReviews = [action.payload, ...newState.allReviews]
            newState.byId[action.payload.id] = action.payload;
            return newState;
        }
        default: { return state }
    }
}

export default reviewsReducer;