import React from 'react';
import Modal from 'react-responsive-modal';
import StarRatings from 'react-star-ratings';
import * as actions from 'actions';
import { toast } from 'react-toastify';
import { ResultError } from 'components/shared/form/ResultError'

export class ReviewModal extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpen: false,
            text: '',
            rating: 3
        }
    }

    openModal = () => {
        this.setState({
            isOpen: true
        })
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        })
    }

    handleTextChange = (event) => {
        this.setState({
            text: event.target.value
        })
    }

    changeRating = (newRating, name) => {
        this.setState({
            rating: newRating
        });
    }

    postReview = () => {
        const { bookingId } = this.props;
        const { text, rating } = this.state;
        console.log(bookingId, text, rating);
        actions.createReview({ text, rating }, bookingId)
            .then(
                review => {
                    console.log(review);
                    this.closeModal();
                    toast.success('Review created');
                },
                errors => {
                    toast.error(errors[0].detail);
                })
    }

    render() {
        const { isOpen, text, rating } = this.state;
        return (
            <React.Fragment>
                <button className='btn btn-custom btn-block' onClick={this.openModal}>Review</button>
                <Modal open={isOpen} onClose={this.closeModal} little classNames={{ modal: 'booking-modal' }}>
                    <h4 className='modal-title title'>Leave a review</h4>
                    <div className='modal-body'>
                        <textarea value={text}
                            onChange={this.handleTextChange}
                            className='form-control'
                            style={{ marginBottom: '10px' }}
                            placeholder='Tell us about your experience'
                            cols='40'
                            rows='3'>
                        </textarea>
                        <StarRatings
                            rating={rating}
                            starRatedColor='orange'
                            starHoverColor='orange'
                            changeRating={this.changeRating}
                            numberOfStars={5}
                            name='rating'
                        />
                    </div>
                    <div className='modal-footer'>
                        <button type='button' disabled={!text || !rating} onClick={this.postReview} className='btn btn-custom'>Confirm</button>
                        <button type='button' onClick={this.closeModal} className='btn btn-custom'>Cancel</button>
                    </div>
                </Modal>
            </React.Fragment>

        );
    }
}