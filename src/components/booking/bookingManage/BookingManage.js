import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from 'actions';
import * as paymentStatus from 'models/paymentStatus';

import { BookingCard } from './BookingCard';
import { PaymentCard } from './PaymentCard';
import CenteredLoading from 'components/shared/loading/CenteredLoading'

class BookingManage extends React.Component {

    componentDidMount() {
        this.props.dispatch(actions.fetchUserBookings());
        this.props.dispatch(actions.getPendingPayments());
    }

    renderBookings(userBookings) {
        return userBookings.map((booking, index) => {
            return (
                <BookingCard key={index} booking={booking} hasReview={!!booking.review} />
            )
        })
    }

    renderPayments(payments) {
        return payments.map((payment, index) => {
            return (
                <PaymentCard key={index}
                    payment={payment}
                    booking={payment.booking}
                    paymentButtons={() => this.renderPaymentButtons(payment._id)}
                />
            )
        })
    }

    renderPaymentButtons(paymentId) {
        return (
            <React.Fragment>
                <button className='btn btn-custom btn-block' onClick={() => this.acceptPayment(paymentId)}>Accept</button>
                <button className='btn btn-custom btn-block' onClick={() => this.declinePayment(paymentId)}>Decline</button>
            </React.Fragment>
        )
    }

    renderUserBookings(userBookings, isLoading) {
        if (isLoading) {
            return (
                <CenteredLoading />
            )
        }
        else {
            if (userBookings.length > 0) {
                return (
                    <div className='row'>
                        {this.renderBookings(userBookings)}
                    </div>
                )
            }
            else {
                return (
                    <div className='alert alert-warning'>
                        You have no bookings created. Go to rentals section and book your place today.
                        <Link style={{ 'marginLeft': '10px' }} className='btn btn-custom' to='/rentals'>Explore</Link>
                    </div>
                )
            }
        }
    }

    acceptPayment(paymentId) {
        actions.acceptPayment({ paymentId })
            .then(status => {
                console.log(status);
                toast.success('Payment accepted.');
                this.props.dispatch(actions.getPendingPayments());
            })
            .catch(err => { console.log(err); toast.error('Payment failed.') })
    }

    declinePayment(paymentId) {
        actions.declinePayment({ paymentId })
            .then(status => {
                console.log(status);
                toast.success('Payment declined.');
                this.props.dispatch(actions.getPendingPayments());
            })
            .catch(err => { console.log(err); toast.error('Payment failed.') })
    }

    renderPendingBookings(payments, isLoading) {
        if (isLoading) {
            return (
                <CenteredLoading />
            )
        }
        else {
            const pendingPayments = payments.filter(x => x.status === paymentStatus.PENDING);
            if (pendingPayments.length > 0) {
                return (
                    <div className='row'>
                        {this.renderPayments(pendingPayments)}
                    </div>
                )
            }
            else {
                return (
                    <div className='alert alert-warning'>
                        You have no payments pending.
                    </div>
                )
            }
        }
    }

    renderRestOfBookings(payments, isLoading) {
        if (isLoading) {
            return (
                <CenteredLoading />
            )
        }
        else {
            const pendingPayments = payments.filter(x => x.status !== paymentStatus.PENDING);
            if (pendingPayments.length > 0) {
                return (
                    <div className='row'>
                        {this.renderPayments(pendingPayments)}
                    </div>
                )
            }
            else {
                return (
                    <div className='alert alert-warning'>
                        You have no payments pending.
                    </div>
                )
            }
        }
    }

    render() {
        const { userBookings, userBookingsAreLoading, pendingPayments, pendingPaymentsAreLoading } = this.props;
        return (
            <React.Fragment>
                <section className='userBookingsAndPayments'>
                    <h1 className='page-title'>My Bookings</h1>
                    {this.renderUserBookings(userBookings, userBookingsAreLoading)}
                </section>
                <section className='userBookingsAndPayments'>
                    <h1 className='page-title'>Pending Bookings</h1>
                    {this.renderPendingBookings(pendingPayments, pendingPaymentsAreLoading)}
                </section>
                <section className='userBookingsAndPayments'>
                    <h1 className='page-title'>Active or Declined Bookings</h1>
                    {this.renderRestOfBookings(pendingPayments, pendingPaymentsAreLoading)}
                </section>
            </React.Fragment>

        )
    }
}

function mapStateToProps(state) {
    return {
        userBookings: state.userBookings.data,
        userBookingsAreLoading: state.userBookings.isLoading,
        pendingPayments: state.payments.data,
        pendingPaymentsAreLoading: state.payments.isLoading
    }
}

export default connect(mapStateToProps)(BookingManage)