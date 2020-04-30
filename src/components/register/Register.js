import React from 'react'
import { Redirect } from 'react-router-dom'
import RegistrationForm from 'components/register/RegistrationForm'

import * as actions from 'actions';

export default class Register extends React.Component {

    constructor(){
        super();
        this.state = {
            errors: [],
            redirectToLogin: false
        };
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser(userData){
        actions.register(userData)
            .then(
                (registered) => {
                    this.setState({
                        redirectToLogin: true
                    });
                },
                (errors) => {
                    this.setState({
                        errors: errors
                    });
                }
            )
    }

    render(){
        const {errors, redirectToLogin} = this.state;

        // Redirect the user to the login screen after a successful registration
        if(redirectToLogin){
            return <Redirect to={{pathname: '/login', state: {successRegister: true}}}/>
        }

        return(
            <section id='register'>
                <div className='custom-form'>
                    <div className='row'>
                    <div className='col-md-5'>
                        <h1>Register</h1>
                        <RegistrationForm submitCallback={this.registerUser} errors={errors}/>
                    </div>
                    <div className='col-md-6 ml-auto'>
                        <div className='image-container'>
                        <h2 className='catchphrase'>Rent my stuff up.</h2>
                        <img src='' alt=""/>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        );
    }
}