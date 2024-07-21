//frontend/src/components/DeleteReviewModal/DeleteReviewModal.jsx
import { useDispatch } from 'react-redux';
// import { deleteReviewThunk } from '../../store/reviews';
import './DeleteReviewModal.css'

const DeleteReviewModal = ({ review, onClose }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            // await dispatch(deleteReviewThunk(review.id));
            onClose();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modalContent">
                <h3>Are you sure you want to delete this review?</h3>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteReviewModal;
