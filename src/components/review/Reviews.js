import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { ReviewPost } from './ReviewPost';

class Reviews extends React.Component {

    componentWillMount() {
        const { rental } = this.props;
        this.props.dispatch(actions.getReviewsForRental(rental._id));
    }

    mapAndRender(reviews, isLoading) {
        if (isLoading) {
            return (<div>Loading...</div>)
        }
        else {
            if (reviews.length > 0) {
                return reviews.map((review, index) =>
                    <ReviewPost key={index} review={review}/>)
            }
            else {
                return (<div>There are no reviews for this property</div>)
            }
        }

    }

    render() {
        const { reviews, isLoading } = this.props;
        return (
            <div>
                <h2>Reviews</h2>
                {this.mapAndRender(reviews, isLoading)}
            </div>
        )
    }


}

const mapStateToProps = state => {
    return {
        reviews: state.reviews.data,
        isLoading: state.reviews.isLoading
    }
}

export default connect(mapStateToProps)(Reviews)

