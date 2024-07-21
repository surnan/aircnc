// frontend/src/components/UpdateReviewModal/UpdateReviewModal.jsx

import './UpdateReviewModal.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateReviewThunk } from '../../store/reviews';

const UpdateReviewModal = ({review, onClose }) => {
    
    const [updatedReview, setUpdatedReview] = useState('');

    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        setUpdatedReview(review.review)
    }, [dispatch, review])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updatedReview.length < 3) {
            setErrors({ review: "Review must be at least 3 characters long" });
            return;
        }

        try {
            await dispatch(updateReviewThunk({ ...review, review: updatedReview }));
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





