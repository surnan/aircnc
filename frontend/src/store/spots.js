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


export const insertSpot = (payload) => async (dispatch) => {
    // console.log('insertSpot - A')
    const { address, city, state, country, lat, lng, name, description, price } = payload;
    const { previewImageURL, image2URL, image3URL, image4URL, image5URL } = payload;
    // const { previewImageURL} = payload;

    
    // console.log('insertSpot - B')
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
    console.log('insertSpot - C')
    const resJSON = await response.json();
    console.log(resJSON, "resJSON")
    console.log('insertSpot - D')


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

    const imageArray = [image2URL, image3URL, image4URL, image5URL];

    // const uploadImage = async (url) => {
    //     if (url) {
    //         await csrfFetch(`/api/spots/${resJSON.id}/images`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 url,
    //                 preview: false
    //             })
    //         });
    //     }
    // };
    
    // const uploadImages = async (imageArray) => {
    //     try {
    //         const uploadPromises = imageArray.map(uploadImage);
    //         await Promise.all(uploadPromises);
    //     } catch (error) {
    //         console.error('Error uploading images:', error);
    //     }
    // };
    
    // await uploadImages(imageArray);
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