import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements';

const formStyles = () => {
    return {
        style: {
            height: '100px',
            marginTop: '15px'

        }
    }
}

const buttonStyles = () => {
    return {
        style: {
            marginTop: '15px'
        }
    }
}

const createOptions = () => {
    return {
        style: {
            base: {
                fontSize: '15px',
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
};

class CheckoutForm extends React.Component {

    state = {
        error: undefined
    }

    handleSubmit = (event) => {
        const { stripe, setPaymentToken } = this.props;
        event.preventDefault();
        if(stripe){
            stripe.createToken().then(
                payload => {
                    if(payload.error){
                        setPaymentToken('')
                        return this.setState({
                            error: payload.error.message
                        });
                    }
                    setPaymentToken(payload.token.id)
                }
            )
        }
        else{
            console.error("Stripe.js isnt loaded yet.");
        }
    }

    render() {
        const {error} = this.state;
        return (
            <form {...formStyles()} onSubmit={this.handleSubmit}>
                <CardElement {...createOptions()} />
                <p>*Payment needs to be approved.</p>
                {error && <div className='alert alert-danger'>{error}</div>}
                <button className='btn btn-custom' {...buttonStyles()}>Confirm payment</button>
            </form>
        )
    }
}

export default injectStripe(CheckoutForm);