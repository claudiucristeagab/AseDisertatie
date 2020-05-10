import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import RentalSearchInput from 'components/rental/RentalSearchInput';

class Header extends React.Component {

    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.logoutCallback();
        toast.success('You are now logged out.')
        this.props.history.push('/rentals');
    }

    renderAuthButtons() {
        const { isAuth } = this.props.auth;
        const { pathname } = this.props.location;

        if (isAuth) {
            return (
                <React.Fragment>
                    <a className='nav-item nav-link clickable' onClick={this.handleLogout}>Logout</a>
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <Link className='nav-item nav-link active' to={{pathname: '/login', state: {initialPath: pathname}}} >Login <span className='sr-only'>(current)</span></Link>
                    <Link className='nav-item nav-link' to='/register'>Register</Link>
                </React.Fragment>
            )
        }
    }

    renderOwnerSection() {
        const { isAuth, username } = this.props.auth;
        if (isAuth) {
            return (
                <React.Fragment>
                    <a className='nav-item nav-link'>{username}</a>
                    <div className="nav-item dropdown">
                        <a className="nav-link nav-item dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Owner Section
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <Link className="dropdown-item" to="/rentals/create">Create Rental</Link>
                            <Link className="dropdown-item" to="/rentals/manage">Manage Rentals</Link>
                            <Link className="dropdown-item" to="/bookings/manage">Manage Bookings</Link>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <nav className='navbar navbar-dark navbar-expand-lg'>
                <div className='container'>
                    <Link className='navbar-brand' to='/rentals'>Bookings</Link>
                    <RentalSearchInput />
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
                        <div className='navbar-nav ml-auto'>
                            {this.renderOwnerSection()}
                            {this.renderAuthButtons()}
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}

export default withRouter(connect(mapStateToProps)(Header));