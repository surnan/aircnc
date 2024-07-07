//frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

// Action Types
const READ_SPOTS_ALL = "spots/loadSpots";

// Actions
export const loadSpots = (data) => {
    return {
        type: READ_SPOTS_ALL,
        data,
    };
};


// Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    const data = await response.json();

    // Convert array-like object to a plain object
    const spotsObject = {};
    for (let key in data.Spots) {
            spotsObject[key] = data.Spots[key];
    }

    dispatch(loadSpots(spotsObject));
};


// Reducer
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case READ_SPOTS_ALL:
            return { ...state, ...action.data };
        default:
            return state;
    }
};

export default spotsReducer;