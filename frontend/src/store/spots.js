//frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/loadSpots";

// Actions
export const loadSpots = (data) => {
    return {
        type: LOAD_SPOTS,
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
        case LOAD_SPOTS:
            return { ...state, ...action.data };
        default:
            return state;
    }
};

export default spotsReducer;







// //frontend/src/store/spots.js

// import { csrfFetch } from "./csrf";

// // Action Types
// const LOAD_SPOTS = "spots/loadSpots";

// // Actions
// export const loadSpots = (data) => {
//     return {
//         type: LOAD_SPOTS,
//         data,
//     };
// };


// // Thunks
// export const fetchSpots = () => async (dispatch) => {
//     const response = await fetch("/api/spots");
//     const data = await response.json();
//     const processed = {};
//     for (let key in data.Spots) {
//         key = Number(key);
//         processed[key + 1] = data.Spots[key];
//     }
//     dispatch(loadSpots(processed));
// };


// // Reducer
// const spotsReducer = (state = {}, action) => {
//     switch (action.type) {
//         case LOAD_SPOTS:
//             return { ...state, ...action.data };
//         default:
//             return state;
//     }
// };

// export default spotsReducer;