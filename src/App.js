import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from 'reducers';
import { ToastContainer, toast } from 'react-toastify';

import * as actions from 'actions';

import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute';
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute';

import Header from 'components/shared/Header';
import {Footer} from 'components/shared/Footer';

import RentalDetail from 'components/rental/rentalDetail/RentalDetail';
import { RentalCreate } from 'components/rental/rentalCreate/RentalCreate';
import RentalSearchListing from 'components/rental/rentalListing/RentalSearchListing';
import { RentalManage } from 'components/rental/rentalManage/RentalManage';

import BookingManage from 'components/booking/bookingManage/BookingManage';

import Login from 'components/login/Login';
import Register from 'components/register/Register';

import 'App.css';

const store = init();

class App extends Component {

  componentWillMount() {
    this.checkAuthState();
  }

  checkAuthState = () => store.dispatch(actions.checkAuthState());

  logoutUser = () => store.dispatch(actions.logout());

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <ToastContainer autoClose={2000} position='bottom-center'/>
            <Header logoutCallback={this.logoutUser} />
            <div className='container'>
              <Switch>
                <Route exact path="/" render={() => { return <Redirect to='/rentals' /> }} />
                <Route exact path="/rentals" component={RentalSearchListing} />
                <ProtectedRoute exact path="/rentals/create" component={RentalCreate} />
                <ProtectedRoute exact path="/rentals/manage" component={RentalManage} />
                <ProtectedRoute exact path="/bookings/manage" component={BookingManage} />
                <ProtectedRoute exact path="/rentals/:id" component={RentalDetail} />
              </Switch>
              <Route exact path="/login" component={Login} />
              <LoggedInRoute exact path="/register" component={Register} />
            </div>
            <Footer/>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
