import React from 'react'
import { connect } from 'react-redux';
import * as actions from 'actions';
import { RentalMap } from './RentalMap';
import { RentalDetailInfo } from './RentalDetailInfo';
import Booking from 'components/booking/Booking';
import Loader from 'react-loader-spinner'

class RentalDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            score: 1
        }
    }

    componentWillMount() {
        const rentalId = this.props.match.params.id;
        this.props.dispatch(actions.fetchRentalById(rentalId));
        actions.getScoreForRental(rentalId)
            .then((score) => {
                this.setState({
                    score
                });
            });
    }

    render() {
        const { rental } = this.props;
        const { score } = this.state;
        if (rental._id) {
            return (
                <section id='rentalDetail'>
                    <div className='upper-section'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <img src={rental.image} alt=''></img>
                            </div>
                            <div className='col-md-6'>
                                <RentalMap location={`${rental.country}, ${rental.city}, ${rental.street}`} />
                            </div>
                        </div>
                    </div>
                    <div className='details-section'>
                        <div className='row'>
                            <div className='col-md-8'>
                                <RentalDetailInfo rental={rental} score={score} />
                            </div>
                            <div className='col-md-4'>
                                <Booking rental={rental} />
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
        else {
            return (
                <div className="d-flex justify-content-center">
                    <Loader type="TailSpin" color="#49cf81" height={80} width={80} />
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        rental: state.rental.data
    }
}

export default connect(mapStateToProps)(RentalDetail)