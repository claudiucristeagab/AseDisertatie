import React from 'react';
import { Link } from 'react-router-dom';
import {RentalManageCard} from './RentalManageCard';
import * as actions from 'actions';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'

export class RentalManage extends React.Component {

    constructor() {
        super();

        this.state = {
            userRentals: [],
            errors: [],
            isLoading: false
        }
        this.deleteRental=this.deleteRental.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        actions.fetchUserRentals().then(
            (userRentals) => {
                this.setState({
                    userRentals,
                    isLoading: false
                })
            },
            (errors) => {
                this.setState({
                    errors,
                    isLoading: false
                })
            }
        );
    }

    mapAndRender(userRentals){
        return userRentals.map((rental, index) => {
            return (
                <RentalManageCard rental={rental} key={index} deleteRental={this.deleteRental}/>
            )
        })
    }

    selectComponent(userRentals, isLoading){
        if (isLoading) {
            return(
                <div className="d-flex justify-content-center">
                    <Loader type="TailSpin" color="#49cf81" height={80} width={80} />
                </div>
            )
        }
        else{
            if (userRentals.length > 0) {
                return (
                    <div className='row'>
                        {this.mapAndRender(userRentals)}
                    </div>
                )
            }
            else {
                return (
                    <div className='alert alert-warning'>
                        You dont have any rentals currenty created. If you want to rent your properties, please click on this link.
                        <Link style={{'marginLeft': '10px'}} className='btn btn-custom' to='/rentals/create'>Create Rental</Link>
                    </div>
                )
            }
        }
    }

    deleteRental(id){
        const {userRentals} = this.state;
        actions.deleteRental(id).then(
            () => {
                this.setState({
                    userRentals: userRentals.filter(x => x._id !== id)
                })
                toast.success('Rental was successfully deleted.');
            },
            errors => {
                toast.error(errors[0].detail);
            }
        )
    }

    render() {
        const {userRentals, isLoading} = this.state;
        return (
            <section id='userRentals'>
                <h1 className='page-title'>My Rentals</h1>
                {this.selectComponent(userRentals, isLoading)}
            </section>
        )
    }
}