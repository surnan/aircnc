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
    const { address, city, state, country, lat, lng, name, description, price } = payload;
    const { previewImageURL, image2URL, image3URL, image4URL, image5URL } = payload;


    try {
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

        const allImageURLs = [
            { url: previewImageURL, preview: "true" },
            { url: image2URL, preview: "false" },
            { url: image3URL, preview: "false" },
            { url: image4URL, preview: "false" },
            { url: image5URL, preview: "false" },
        ]

        for (const { url, preview } of allImageURLs) {
            if (url) {
                await csrfFetch(`/api/spots/${resJSON.id}/images`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            url,
                            preview
                        })
                    })
            }
        }
    } catch (err) {
        console.log("Failed to insert spot: ", err)
    }
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

