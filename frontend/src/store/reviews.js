//frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS_SPOT = "reviews/loadReviewsSpot"
const LOAD_REVIEWS_USER = "reviews/loadReviewsUser"
const POST_REVIEW_ONE = "reviews/postReviewOne"
const REMOVE_REVIEW_ONE = "reviews/removeReviewOne"
const UPDATE_REVIEW_ONE = "reviews/updateReviewOne"


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

const removeReviewOne = (data) => {
    return {
        type: REMOVE_REVIEW_ONE,
        payload: data
    };
};

const updateReviewOne = (data) => {
    return {
        type: UPDATE_REVIEW_ONE,
        payload: data
    };
};

//Thunks
export const getReviewsSpotThunk = (spotId) => async (dispatch) => {
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

export const deleteReviewThunk = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        header: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
        const reviewData = await res.json();
        await dispatch(removeReviewOne(id));
        return reviewData;
    }
}

export const postReviewThunk = (id, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const reviewData = await res.json();
        await dispatch(postReviewOne(reviewData));
        return reviewData;
    }
}

export const updateReviewThunk = (review) => async (dispatch) => {

    console.log(`[review.id, review] = [${review.id}, ${JSON.stringify(review)}]`)
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const reviewData = await res.json();
        await dispatch(updateReviewOne(reviewData));
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
            newState.allReviews = action.payload.Reviews
            return newState
        }
        case POST_REVIEW_ONE: {
            let newState = { ...state }
            newState.allReviews = [action.payload, ...newState.allReviews]
            newState.byId[action.payload.id] = action.payload;
            return newState;
        }
        case REMOVE_REVIEW_ONE: {
            let newState = { ...state }
            newState.allReviews = newState.allReviews.filter(review => review.id !== action.payload);
            delete newState.byId[action.payload];
            return newState;
        }
        case UPDATE_REVIEW_ONE: {
            let newState = { ...state }
            // newState.allReviews = newState.allReviews.filter(review => review.id !== action.payload);
            // delete newState.byId[action.payload];
            // return newState;

            console.log(`>>>>>>> action =>  ${action}`)

            return newState
        }
        default: { return state }
    }
}

export default reviewsReducer;