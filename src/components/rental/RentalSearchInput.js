import React from 'react'
import { withRouter, Link } from 'react-router-dom';

class RentalSearchInput extends React.Component {
    constructor() {
        super();
        this.searchInput = React.createRef();
        this.search = this.search.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if(event.key === 'Enter'){
            this.search();
        }
    }

    search() {
        const { history } = this.props;
        const searchQuery = this.searchInput.current.value;
        searchQuery ? history.push(`/rentals?search=${searchQuery}`) : history.push('/rentals');
    }

    render() {
        return (
            <div className='form-inline my-2 my-lg-0'>
                <input
                    onKeyPress={(event) => this.handleKeyPress(event)}
                    ref={this.searchInput}
                    className='form-control mr-sm-2 bwm-search'
                    type='search' placeholder='Try "Wuhan"'
                    aria-label='Search'></input>
                <button
                    onClick={this.search}
                    className='btn btn-outline-success my-2 my-sm-0 btn-bwm-search'
                    type='submit'>
                    Search
                </button>
            </div>
        )
    }
}

export default withRouter(RentalSearchInput);