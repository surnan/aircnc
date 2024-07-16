//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotsOwned.css";

import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpotsAllThunk, getSpotsOwnedThunk } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";

function SpotsOwned() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const spotsArr = useSelector(state => state.spots.allSpots)
    const [isLoaded, setIsLoaded] = useState(false);


    const handleSpotClick = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`click ||| spot.id = ${spot.id}`)

        nav(`/spots/${spot.id}`)
    }

    useEffect(() => {
        dispatch(getSpotsOwnedThunk())
    }, [dispatch]);


    return (
        <>
            <h1>Manage Your Spots</h1>
            <button className="greyButton">Create a New Spot </button>
            <div className="splashSpotGrid">
                <hr />
                <hr />
                <hr />
                <hr />


                {
                    spotsArr.map((spot, idx) => (
                        <div
                            key={`${spot.id}-${idx}-spot`}
                            className="clickable spotSquare"
                            onClick={e => handleSpotClick(e, spot)}
                        >
                            <SpotCard spot={spot} />
                        </div>
                    ))
                }
            </div>
        </>
    );
}
export default SpotsOwned;


