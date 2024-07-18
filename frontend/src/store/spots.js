//frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

const LOAD_SPOTS_ALL = "spots/loadSpotAll"
const LOAD_SPOTS_ONE = "spots/loadSpotOne"
const LOAD_SPOTS_OWNED = "spots/loadSpotsOwned"

const DELETE_SPOT_ONE = "spots/deleteSpotOne"
const UPDATE_SPOT_ONE = "spots/updateSpotOne"
const ADD_SPOT_ONE = 'spots/addSpotOne';

// Actions
const updateSpotOne = (data) => {
    return {
        type: ADD_SPOT_ONE,
        payload: data
    };
};


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

const loadSpotsOwned = (data) => {
    return {
        type: LOAD_SPOTS_OWNED,
        payload: data,
    };
};

const deleteSpotOne = (data) => ({
    type: DELETE_SPOT_ONE,
    payload: data
})

const addSpotOne = (data) => ({
    type: ADD_SPOT_ONE,
    payload: data
})

//Thunks
export const getSpotsAllThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsAll(data))
        return data
    }
}

export const getSpotsOwnedThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current");
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsOwned(data));
    }
};


export const getSpotsOneThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsOne(data))
        return data
    }
}


export const deleteSpotOneThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json()
        dispatch(deleteSpotOne(spotId))
        return data
    }
}


const insertSpotImages = async ({ spotId, previewImageURL, sideImageURLs }) => {
    // post preview image
    await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: previewImageURL, preview: 'true' }),
    });

    // post side images
    for (let url of sideImageURLs) {
        //   if (!url) continue;
        if (!url) {
            url = previewImageURL;
        }
        await csrfFetch(`/api/spots/${spotId}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url, preview: 'false' }),
        });
    }
};

export const insertSpot = async ({ body, previewImageURL, sideImageURLs }) => {

    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    await insertSpotImages({ spotId: data.id, previewImageURL, sideImageURLs });
    return data.id;
}

export const addSpotOneThunk = (spot) => async (dispatch) => {
    const { body, previewImageURL, sideImageURLs } = spot;
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });

    const data = await response.json();
    await insertSpotImages({ spotId: data.id, previewImageURL, sideImageURLs });

    if (response.ok) {
        dispatch(addSpotOne(data))
        return data.id
    }
}


export const updateSpotThunk = (spot) => async (dispatch) => {
    const { body, previewImageURL, sideImageURLs, spotId } = spot;
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    const data = await response.json();
    await insertSpotImages({ spotId: data.id, previewImageURL, sideImageURLs });

    if (response.ok) {
        dispatch(updateSpotOne(data))
        // return data.id
        return spotId
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
        case LOAD_SPOTS_OWNED: {
            let newState = { ...state }
            newState.allSpots = action.payload.Spots;
            for (let spot of action.payload.Spots) {
                newState.byId[spot.id] = spot
            }
            return newState;
        }
        case DELETE_SPOT_ONE: {
            let newState = { ...state }
            newState.allSpots = newState.allSpots.filter(spot => spot.id !== action.payload);
            delete newState.byId[action.payload];

            if (newState.single.id === action.payload) {
                newState.single = {};
            }
            return newState
        }
        case ADD_SPOT_ONE: {
            let newState = { ...state }
            newState.allSpots = [...newState.allSpots, action.payload]
            newState.byId[action.payload.id] = action.payload;
            newState.single = action.payload;
            return newState;
        }

        case ADD_SPOT_ONE: {

            console.log('>>>>> updatethunk >>>>> action = ', action)


        }
        default: { return state }
    }
}

export default spotsReducer;