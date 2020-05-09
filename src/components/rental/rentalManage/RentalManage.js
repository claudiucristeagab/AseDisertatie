import React from 'react';
import { Link } from 'react-router-dom';
import {RentalManageCard} from './RentalManageCard';
import * as actions from 'actions';

export class RentalManage extends React.Component {

    constructor() {
        super();

        this.state = {
            userRentals: [],
            errors: []
        }
    }

    componentWillMount() {
        actions.fetchUserRentals().then(
            (userRentals) => {
                this.setState({
                    userRentals
                })
            },
            (errors) => {
                this.setState({
                    errors
                })
            }
        );
    }

    mapAndRender(userRentals){
        return userRentals.map((rental, index) => {
            return (
                <RentalManageCard rental={rental} key={index}/>
            )
        })
    }

    selectComponent(userRentals){
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
                    You dont have any rentals currenty created. If you wan t to rent your properties, please click on this link.
                    <Link style={{'marginLeft': '10px'}} className='btn btn-custom' to='/rentals/create'>Register Rental</Link>
                </div>
            )
        }
    }

    render() {
        const {userRentals} = this.state;
        return (
            <section id='userRentals'>
                <h1 className='page-title'>My Rentals</h1>
                {this.selectComponent(userRentals)}
            </section>
        )
    }
}