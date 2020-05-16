import React from 'react'
import { RentalAssets } from './RentalAssets';
import Reviews from 'components/review/Reviews';
import { rentalType } from 'helpers';

export function RentalDetailInfo(props){
    const rental = props.rental;
    return (
        <div className='rental'>
            <h2 className={`rental-type ${rental.category}`}>{rental.category}</h2> 
            <h1 className='rental-title'>{rental.title}</h1>
            <h2 className='rental-city'>Posted by {rental.user.username} ({rental.user.email})</h2>
            <h2 className='rental-city'>{rental.country}, {rental.city}, {rental.street}, {rental.address}</h2>
            <div className='rental-room-info'>
                <span><i className='fa fa-building'></i>{rental.bedrooms} bedrooms</span>
                <span><i className='fa fa-user'></i> {rental.guests} guests</span>
                <span><i className='fa fa-bed'></i> {rental.beds} beds</span>
            </div>
            <p className='rental-description'>
                {rental.description}
            </p>
            <hr></hr>
            <Reviews rentalId={rental._id}/>
        </div>   
    )
}