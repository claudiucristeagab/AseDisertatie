import React from 'react';
import { Link } from 'react-router-dom';
import * as actions from 'actions';
import { connect } from 'react-redux';
import { BookingCard } from './BookingCard';

class BookingManage extends React.Component {

    componentWillMount() {
        this.props.dispatch(actions.fetchUserBookings());
    }

    mapAndRender(userBookings) {
        return userBookings.map((booking, index) => {
            return (
                <BookingCard key={index} booking={booking} />
            )
        })
    }

    selectComponent(userBookings, isLoading) {
        if (isLoading) {
            return (
                <h1>Loading...</h1>
            )
        }
        else {
            if (userBookings.length > 0) {
                return (
                    <div className='row'>
                        {this.mapAndRender(userBookings)}
                    </div>
                )
            }
            else {
                return (
                    <div className='alert alert-warning'>
                        You have no bookings created. Go to rentals section and book your place today.
                        <Link style={{ 'marginLeft': '10px' }} className='btn btn-custom' to='/rentals'>Available Rental</Link>
                    </div>
                )
            }
        }
    }

    render() {
        const { userBookings, isLoading } = this.props;
        return (
            <section id='userBookings'>
                <h1 className='page-title'>My Bookings</h1>
                {this.selectComponent(userBookings, isLoading)}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        userBookings: state.userBookings.data,
        isLoading: state.userBookings.isLoading
    }
}

export default connect(mapStateToProps)(BookingManage)