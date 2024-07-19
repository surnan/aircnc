//frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS_SPOT = "reviews/loadReviewsSpot"
const LOAD_REVIEWS_USER = "reviews/loadReviewsUser"


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
    dispatch(loadReviewsUser())
    return data
}

/*testing*/

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

            // console.log('LOAD_REVIEWS_SOT: ', JSON.stringify(action))

            let newState = {...state}
            newState.allReviews = action.payload.Reviews;


            for (let review of action.payload.Reviews){
                newState.byId[review.id] = review
            }

            // newState.currentUser = action.payload.Reviews.

            return newState;
        }
        case LOAD_REVIEWS_USER: {
            let newState = {...state}
            return newState
        }
        default: {return state}
    }
}

export default reviewsReducer;