import React from 'react'
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'

export default class Payment extends React.Component {

    render() {
        return (
            <Elements>
                <CheckoutForm {...this.props}/>
            </Elements>
        )
    }
}