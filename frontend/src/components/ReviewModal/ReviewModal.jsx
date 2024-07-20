// frontend/src/components/ReviewModal/ReviewModal.jsx

import { useState, useEffect } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ onClose, onSubmit }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


    useEffect(() => {
        if (review.length >= 10 && rating > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [review, rating]);

    const handleMouseEnter = (star) => {
        setHoverRating(star);
    };

    const handleMouseLeave = (star) => {
        setHoverRating(0);
    };

    const handleClick = (star) => {
        setRating(star);
        console.log('rating = ', star)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ review, rating });
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>How was your stay?</h2>
                <form onSubmit={handleSubmit} className='reviewForm'>
                    <textarea
                        value={review}
                        placeholder='Leave your review here...'
                        onChange={(e) => setReview(e.target.value)}
                        className='addReviewText'
                        required
                    >
                    </textarea>
                    <div className='starDiv'>
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            const isFilled = starValue <= (hoverRating || rating);
                            return (
                                <div
                                    key={index}
                                    className={`starImage clickable star${starValue}`}
                                    onMouseEnter={() => handleMouseEnter(starValue)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleClick(starValue)}
                                >
                                    {/* html entities crash with &#9733; &#9734;, needs to be Unicode values */}
                                    {isFilled ? '\u2605' : '\u2606'}
                                </div>
                            );
                        })}
                        <span className="smallFont">&#160;Stars</span>
                    </div>
                    <button
                        type="submit"
                        className={`submitReviewButtonModal ${!isButtonDisabled ? 'enabled' : ''}`}
                        disabled={isButtonDisabled}
                    >
                        Submit Your Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;