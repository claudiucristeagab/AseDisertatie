import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from 'reducers';

import Header from 'components/shared/Header';
import RentalDetail from 'components/rental/rentalDetail/RentalDetail';
import { RentalCreate } from 'components/rental/rentalCreate/RentalCreate';
import RentalSearchListing from 'components/rental/rentalListing/RentalSearchListing';
import Login from 'components/login/Login';
import Register from 'components/register/Register';
import * as actions from 'actions';

import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute';
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute';

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
            <Header logoutCallback={this.logoutUser} />
            <div className='container'>
              <Switch>
                <Route exact path="/" render={() => { return <Redirect to='/rentals' /> }} />
                <Route exact path="/rentals" component={RentalSearchListing} />
                <ProtectedRoute exact path="/rentals/create" component={RentalCreate} />
                <ProtectedRoute exact path="/rentals/:id" component={RentalDetail} />
              </Switch>
              <Route exact path="/login" component={Login} />
              <LoggedInRoute exact path="/register" component={Register} />
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
