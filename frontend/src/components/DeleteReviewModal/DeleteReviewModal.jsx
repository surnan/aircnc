//frontend/src/components/DeleteReviewModal/DeleteReviewModal.jsx
import { useDispatch } from 'react-redux';
import { deleteReviewThunk } from '../../store/reviews';
import './DeleteReviewModal.css'

const DeleteReviewModal = ({ review, onClose }) => {

    console.log(`>>>> DeleteReviewModal.review.id = ${JSON.stringify(review.id)}`)

    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteReviewThunk(review.id));
            onClose();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div className="confirmDeleteModal">
            <div className="modalContent">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to remove this spot from the listings?</p>
                <button onClick={handleDelete} className="deleteButton">Yes (Delete Review)</button>
                <button onClick={onClose} className="cancelButton">No (Keep Review)</button>
            </div>
        </div>
    );
};

export default DeleteReviewModal;
