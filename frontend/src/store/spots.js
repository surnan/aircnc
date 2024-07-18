//frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

const LOAD_SPOTS_ALL = "spots/loadSpotAll"
const LOAD_SPOTS_ONE = "spots/loadSpotOne"
const LOAD_SPOTS_OWNED = "spots/loadSpotsOwned"

const DELETE_SPOT_ONE = "spots/deleteSpotOne"
const UPDATE_SPOT_ONE = "spots/updateSpotOne"
const ADD_SPOT_ONE = 'spots/addSpotOne';

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
        console.log('getSpotsOwnedThunk -> data = ', data)
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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    await insertSpotImages({ spotId: data.id, previewImageURL, sideImageURLs });

    console.log('1 - data.id = ', data.id)
    if (response.ok) {
        dispatch(addSpotOne(data))
        console.log('2 - data.id = ', data.id)
        return data.id
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
            console.log(`>>>>>>>>>>>>>>>>>> newState => ${newState}`)
            return newState;
        }
        default: { return state }
    }
}

export default spotsReducer;


/*
export const insertSpot2 = (payload) => async (dispatch) => {
    // console.log('insertSpot - A')
    const { address, city, state, country, lat, lng, name, description, price } = payload;
    // const { previewImageURL, image2URL, image3URL, image4URL, image5URL } = payload;
    const { previewImageURL } = payload;


    console.log('insertSpot - B')

    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }),
    });

    const resJSON = await response.json();

    if (resJSON.id && previewImageURL) {
        const previewImageLoad = await csrfFetch(`/api/spots/${resJSON.id}/images`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: previewImageURL,
                    preview: "true"
                })
            })
    }

    const data = await response.json()

    console.log('data = ', data)


    const uploadImage = async (url) => {
        if (url) {
            await csrfFetch(`/api/spots/${resJSON.id}/images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url,
                    preview: "false"
                })
            });
        }
    };

    const uploadImages = async (imageArray) => {
        try {
            const uploadPromises = imageArray.map(uploadImage);
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    await uploadImages(imageArray);
}

*/