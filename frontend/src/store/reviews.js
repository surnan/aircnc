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
    dispatch(loadSpotsAll(data))
    return data
}

export const getReviewsUserThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current')
    const data = await response.json();
    dispatch(loadSpotsAll(data))
    return data
}


// State object
const initialState = {
    allReviews: [],
    byId: {}
}

//Reducers
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS_SPOT: {
            let newState = {...state}
            return newState;
        }
        case LOAD_REVIEWS_USER: {
            let newState = {...state}
            return newState
        }

        default:
            {
                return state
            }

    }
}

export default reviewsReducer;