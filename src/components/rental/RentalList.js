import React from 'react'
import { RentalCard } from './RentalCard'

export class RentalList extends React.Component {
    constructor(){
        super();

        this.state = {
            rentals: [1,2,3]
        };
    }

    mapAndRender(){
        return this.state.rentals.map((rental, index) => {
            return (
                <RentalCard key={index}/>
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