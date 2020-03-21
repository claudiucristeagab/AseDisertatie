import React from 'react'
import { Link } from 'react-router-dom';

export function RentalCard(props) {
    const rental = props.rental;
    const detailLink = '/rentals/' + rental.id;
    return (
        <div class='col-md-3 col-xs-6'>
            <Link to={detailLink}>
                <div class='card bwm-card'>
                    <img class='card-img-top' src={rental.image} alt=''></img>
                    <div class='card-block'>
                        <h6 class='card-subtitle'>{rental.shared ? 'Shared' : 'Whole'} {rental.category} &#183; {rental.city}</h6>
                        <h4 class='card-title'>{rental.title}</h4>
                        <p class='card-text'>${rental.dailyRate} per Night &#183; Free Cancelation</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}