import React from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from 'actions';
import { ToastContainer, toast } from 'react-toastify';
import LoginForm from 'components/login/LoginForm';
//import LoginForm2 from 'components/login/LoginForm2';

class Login extends React.Component {

    constructor(){
        super();
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(userData) {
        this.props.dispatch(actions.login(userData));
    }

    render(){
        const { isAuth, errors } = this.props.auth;
        const { successRegister } = this.props.location.state || false;
        const { initialPath } = this.props.location.state || '/rentals';

        if(isAuth){
            toast.success('You are now logged in.')
            return <Redirect to={{pathname: initialPath || '/rentals'}}/>
        }

        return(
            <section id="login">
                <div className="custom-form">
                    <div className="row">
                        <div className="col-md-5">
                            <h1>Login</h1>
                            {
                                successRegister && 
                                <div className='alert alert-success'>
                                    Registration successful. You may now login.
                                </div>
                            }
                            <LoginForm loginCallback={this.loginUser} errors={errors}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(Login);