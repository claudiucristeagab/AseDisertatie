import React from 'react';
import RentalCreateForm from './RentalCreateForm';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'

import * as actions from 'actions';

class RentalModify extends React.Component {

    constructor() {
        super();
        this.state = {
            errors: [],
            redirect: false,
            redirectRentalId: ''
        }
        this.rentalCateogies = ['apartment', 'house', 'condo'];
        this.modifyRental = this.modifyRental.bind(this);
    }

    componentWillMount() {
        const rentalId = this.props.match.params.id;
        this.props.dispatch(actions.fetchRentalById(rentalId));
    }

    displayComponents(rental) {
        if (rental._id) {
            return (
                <section id='newRental'>
                    <div className='custom-form m-2'>
                        <RentalCreateForm submitCb={this.modifyRental}
                            options={this.rentalCateogies}
                            errors={this.state.errors}
                            initialValues={rental}
                            isModify={true}
                        />
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

    modifyRental(rentalData) {
        console.log(rentalData);
        const { rental } = this.props;
        if (rentalData.image !== rental.image) {
            actions.uploadImage(rentalData.image).then(
                (imageUrl) => {
                    const updatedRentalData = { ...rentalData, image: imageUrl };
                    actions.updateRental(rental._id, updatedRentalData).then(
                        (rental) => {
                            toast.success('Rental property has been listed.');
                            this.setState({ redirect: true, redirectRentalId: rental._id })
                        },
                        (errors) => this.setState({ errors }))
                },
                (errors) => {
                    this.setState({ errors })
                }
            )
        }
        else {
            const updatedRentalData = { ...rentalData, image: rental.image };
            actions.updateRental(rental._id, updatedRentalData).then(
                (rental) => {
                    toast.success('Rental property has been modified.');
                    this.setState({ redirect: true, redirectRentalId: rental._id })
                },
                (errors) => this.setState({ errors }))
        }
        
    }

    render() {
        const { rental } = this.props;
        const { redirect, redirectRentalId } = this.state;
        if (redirect) {
            return <Redirect to={{ pathname: `/rentals/${redirectRentalId}` }} />
        }
        return (
            <React.Fragment>
                <h1 className='page-title'>Modify Rental</h1>
                {this.displayComponents(rental)}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        rental: state.rental.data
    }
}

export default connect(mapStateToProps)(RentalModify)