import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

class Reviews extends React.Component {

    componentWillMount() {
        const {rentalId} = this.props;
        this.props.dispatch(actions.getReviewsForRental(rentalId));
    }

    mapAndRender(reviews){
        return reviews.map((review, index) => {
            return (
                <p key={index}>{review.text} ({review.rating}/5), posted on {review.createdAt} by {review.user.username}</p>
            )
        })
    }

    render() {
        const {reviews} = this.props;
        return (
            <div>
                {this.mapAndRender(reviews)}
            </div>
        )
    }

    
}

const mapStateToProps = state => {
    return {
        reviews: state.reviews.data
    }
}

export default connect(mapStateToProps)(Reviews)

