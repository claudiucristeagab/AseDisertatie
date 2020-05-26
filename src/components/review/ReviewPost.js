import React from 'react';
import StarRatings from 'react-star-ratings';
import {formatDate} from 'helpers';

export class ReviewPost extends React.Component {
    render() {
        const {review} = this.props;

        return (
            <div className="card review-card">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2 user-image">
                        <p className="text-secondary text-center">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="col-md-10">
                        <div>
                            <a><strong>{`${review.user.username} (${review.user.email})`}</strong></a>
                            <a> Stayed on {`${formatDate(review.booking.startAt)} - ${formatDate(review.booking.endAt)}`}</a>
                            <div className="review-section">
                                <StarRatings
                                    rating={review.rating}
                                    starRatedColor="orange"
                                    starHoverColor="orange"
                                    starDimension="25px"
                                    starSpacing="2px"
                                    numberOfStars={5}
                                    name='rating'
                                />
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <p>{review.text}</p>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}