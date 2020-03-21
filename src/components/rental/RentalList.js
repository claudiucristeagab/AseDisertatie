import React from 'react'
import { RentalCard } from './RentalCard'
import { connect } from 'react-redux';
import * as actions from '../../actions';

class RentalList extends React.Component {

    mapAndRender(){
        return this.props.rentals.map((rental, index) => {
            return (
                <RentalCard 
                    key={index} 
                    rental={rental}
                />
            )
        })
    }

    componentWillMount() {
        this.props.dispatch(actions.fetchRentals());
    }

    render() {
        return (
            <section id='rentalListing'>
            <h1 className='page-title'>Home is where you want it</h1>
                <div className='row'>
                    {this.mapAndRender()}
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        rentals: state.rentals.data
    }
}

export default connect(mapStateToProps)(RentalList)