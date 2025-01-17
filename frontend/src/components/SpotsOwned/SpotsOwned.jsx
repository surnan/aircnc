//frontend/src/components/SpotCard/SpotsOwned.jsx
import "./SpotsOwned.css";


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpotsOwnedThunk } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";

import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";  /////////////

function SpotsOwned() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const spotsArr = useSelector(state => state.spots.allSpots)
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);  /////////////
    const [selectedSpot, setSelectedSpot] = useState(null);  /////////////

    const handleSpotClick = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        nav(`/spots/${spot.id}`)
    }

    useEffect(() => {
        dispatch(getSpotsOwnedThunk()).then(() => setIsLoaded(true))
    }, [dispatch]);

    const handleCreateNewSpotBtn = (e) => {   //const handleCreateNewSpotBtn = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        nav(`/spots/new`)
    }

    const handleUpdateBtn = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        nav(`/spots/${spot.id}/edit`)
    }

    const handleDeleteBtn = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedSpot(spot)       /////////////
        setShowDeleteModal(true)    /////////////
    }

    // const handleConfirmDelete = async () => {
    //     await dispatch(deleteSpotOneThunk(selectedSpot.id));
    //     setShowDeleteModal(false);  // Close the delete modal
    //     setSelectedSpot(null);  // Clear the selected spot
    // }

    return (
        <>
            <h1>Manage Your Spots</h1>
            <button
                className="greyButton clickable"
                onClick={handleCreateNewSpotBtn}
            >
                Create a New Spot
            </button>

            <div className="splashSpotGrid">
                {
                    isLoaded && spotsArr.map((spot, idx) => (
                        <div key={`${spot.id}-${idx}-spot`}>
                            <div
                                className="clickable spotSquare"
                                onClick={e => handleSpotClick(e, spot)}
                            >
                                <SpotCard spot={spot} />
                            </div>
                            <div>
                                <button
                                    className="greyButton clickable"
                                    onClick={e => handleUpdateBtn(e, spot)}
                                >
                                    Update
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button
                                    className="greyButton clickable"
                                    onClick={e => handleDeleteBtn(e, spot)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            {showDeleteModal && (
                <ConfirmDeleteModal
                    spotId={selectedSpot.id}
                    onClose={() => setShowDeleteModal(false)}  // Close the modal
                />
            )}
        </>
    );
}
export default SpotsOwned;


