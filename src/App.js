import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from 'reducers';

import Header from 'components/shared/Header';
import RentalDetail from 'components/rental/rentalDetail/RentalDetail';
import RentalListing from 'components/rental/rentalListing/RentalListing';
import Login from 'components/login/Login';
import Register from 'components/register/Register';
import * as actions from 'actions';

import 'App.css';

const store = init();

class App extends Component {

  componentWillMount() {
    this.checkAuthState();
  }

  checkAuthState = () => store.dispatch(actions.checkAuthState());

  logoutUser = () =>  store.dispatch(actions.logout());

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Header logoutCallback={this.logoutUser}/>
            <div className='container'>
              <Route exact path="/" render={() => { return <Redirect to='/rentals'/> }}/>
              <Route exact path="/rentals" component={RentalListing}/>
              <Route exact path="/rentals/:id" component={RentalDetail}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
