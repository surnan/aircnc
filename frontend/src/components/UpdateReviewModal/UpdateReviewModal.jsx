// frontend/src/components/UpdateReviewModal/UpdateReviewModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { updateReviewThunk } from '../../store/reviews';
import './UpdateReviewModal.css';

const UpdateReviewModal = ({ review, onClose }) => {
    const dispatch = useDispatch();
    const [updatedReview, setUpdatedReview] = useState(review.review);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updatedReview.length < 3) {
            setErrors({ review: "Review must be at least 3 characters long" });
            return;
        }

        try {
            // await dispatch(updateReviewThunk({ ...review, review: updatedReview }));
            onClose();
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modalContent">
                <h3>Update Review</h3>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={updatedReview}
                        onChange={(e) => setUpdatedReview(e.target.value)}
                    />
                    {errors.review && <p className="error">{errors.review}</p>}
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateReviewModal;
