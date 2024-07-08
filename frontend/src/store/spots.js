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

export const insertSpot = (payload) => async (dispatch) => {
    // console.log('insertSpot - A')
    const { address, city, state, country, lat, lng, name, description, price } = payload;
    const { previewImageURL} = payload;
    // const { previewImageURL, image2URL, image3URL, image4URL, image5URL } = payload;

    
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
                body: JSON.stringify({
                    url: previewImageURL,
                    preview: "true"
                })
            })
    }

    // const imageArray = [image2URL, image3URL, image4URL, image5URL];

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

// Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    const data = await response.json();

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