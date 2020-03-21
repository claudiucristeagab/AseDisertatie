import React from 'react'
import { RentalCard } from './RentalCard'
import { connect } from 'react-redux';

class RentalList extends React.Component {
    constructor(){
        super();
    }

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
    render() {
        return (
            <section id='rentalListing'>
            <h1 class='page-title'>Home is where you want it</h1>
                <div class='row'>
                    {this.mapAndRender()}
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        rentals: state.rentals
    }
}

export default connect(mapStateToProps)(RentalList)