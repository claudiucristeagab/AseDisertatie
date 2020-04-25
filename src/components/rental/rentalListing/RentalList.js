import React from 'react'
import { RentalCard } from './RentalCard'

export class RentalList extends React.Component {
    mapAndRender(){
        return this.props.rentals.map((rental, index) => {
            return (
                <RentalCard 
                    key={index}
                    column='col-md-3 col-xs-6'     
                    rental={rental}
                />
            )
        })
    }

    render() {
        return (
            <div className='row'>
                {this.mapAndRender()}
            </div>
        )
    }
}