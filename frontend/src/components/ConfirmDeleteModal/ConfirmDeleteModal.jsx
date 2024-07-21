// frontend/src/components/ConfirmDeleteModal/ConfirmDeleteModal.jsx


import { useDispatch } from 'react-redux';
import { deleteSpotOneThunk } from '../../store/spots';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ spotId, onClose }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteSpotOneThunk(spotId));
            onClose();
        } catch (error) {
            console.error('Error deleting spot:', error);
        }
    };

    return (
        <div className="confirmDeleteModal">
            <div className="modalContent">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to remove this spot from the listings?</p>
                <button onClick={handleDelete} className="deleteButton">Yes (Delete Spot)</button>
                <button onClick={onClose} className="cancelButton">No (Keep Spot)</button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;