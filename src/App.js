import React, { Component } from 'react';

import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';
import { init } from 'reducers';

import { Header } from 'shared/Header';
import RentalDetail from 'components/rental/rentalDetail/RentalDetail';
import RentalList from 'components/rental/rentalListing/RentalList';
import 'App.css';

class App extends Component {
  render() {
    return (
      <Provider store={init()}>
        <BrowserRouter>
          <div className="App">
            <Header/>
            <div className='container'>
              <Route exact path="/" render={() => { return <Redirect to='/rentals'/> }}/>
              <Route exact path="/rentals" component={RentalList}/>
              <Route exact path="/rentals/:id" component={RentalDetail}/>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
