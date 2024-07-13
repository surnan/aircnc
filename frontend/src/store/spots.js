//frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

const LOAD_SPOTS_ALL = "spots/loadSpotAll"
const LOAD_SPOTS_ONE = "spots/loadSpotOne"

// Actions
const loadSpotsAll = (data) => {
    return {
        type: LOAD_SPOTS_ALL,
        payload: data
    };
};

const loadSpotsOne = (data) => {
    return {
        type: LOAD_SPOTS_ONE,
        payload: data
    };
};

//Thunks
export const getSpotsAllThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsAll(data))
        return data
    }
}

export const getSpotsOneThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsOne(data))
        return data
    }
}


// State object
const initialState = {
    allSpots: [],
    byId: {},
    single: {} 
}

//Reducers
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS_ALL: {
            let newState = { ...state }
            newState.allSpots = action.payload.Spots;
            //"S" Spots because of the JSON.  
            //"s" lower-case inside 'spots' reducer is not factor in next line.
            for (let spot of action.payload.Spots) {
                newState.byId[spot.id] = spot
            }
            return newState;
        }
        case LOAD_SPOTS_ONE: {
            let newState = { ...state }
            newState.single = action.payload
            return newState
        }
        default: {return state}
    }
}

export default spotsReducer;