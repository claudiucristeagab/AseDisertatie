import React from 'react';
import RentalCreateForm from './RentalCreateForm';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import * as actions from 'actions';

export class RentalCreate extends React.Component {

    constructor() {
        super();
        this.state = {
            errors: [],
            redirect: false,
            redirectRentalId: ''
        }
        this.rentalCateogies = ['apartment', 'house', 'condo'];
        this.createRental = this.createRental.bind(this);
    }

    createRental(rentalData) {
        debugger;
        actions.uploadImage(rentalData.image).then(
            (imageUrl) => {
                const updatedRentalData = {...rentalData, image: imageUrl};
                actions.createRental(updatedRentalData).then(
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

    render() {
        const { redirect, redirectRentalId } = this.state;
        if (redirect) {
            return <Redirect to={{ pathname: `/rentals/${redirectRentalId}` }} />
        }

        return (
            <section id='newRental'>
                <div className='custom-form m-2'>
                    <h1 className='page-title'>Create Rental</h1>
                    <RentalCreateForm submitCb={this.createRental}
                        options={this.rentalCateogies}
                        errors={this.state.errors} 
                        initialValues={baseInitialValues}
                        isModify={false}
                    />
                </div>
            </section>
        )
    }
}

const baseInitialValues = { category: 'apartment', bedrooms: 1, beds: 1, guests: 1 }