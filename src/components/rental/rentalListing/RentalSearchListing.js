import React from 'react'
import { RentalList } from './RentalList'
import { connect } from 'react-redux';
import * as actions from 'actions';
import queryString from 'query-string';

class RentalSearchListing extends React.Component {

    constructor() {
        super();
        this.state = {
            searchedQuery: ''
        }
    }
    componentWillMount() {
        const searchQuery = queryString.parse(this.props.location.search).search;
        this.searchRentals(searchQuery);
    }

    componentDidUpdate(){
        const {searchedQuery} = this.state;
        const currentSearchQuery = queryString.parse(this.props.location.search).search;
        if(currentSearchQuery !== searchedQuery){
            this.searchRentals(currentSearchQuery);
        }
    }

    searchRentals(searchQuery){
        this.setState({
            searchedQuery: searchQuery
        });
        this.props.dispatch(actions.fetchRentals(searchQuery));
    }

    render() {
        const { searchedQuery } = this.state;
        const { rentals, errors } = this.props;
        console.log(errors);
        return (
            <section id='rentalListing'>
                {
                    searchedQuery &&
                    <h1 className='page-title'>Rentals in {searchedQuery}</h1>
                }
                {
                    errors.length > 0 &&
                    <h2 className='page-title'>{errors[0].detail}</h2>
                }
                <RentalList rentals={rentals} />
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        rentals: state.rentals.data,
        errors: state.rentals.errors
    }
}

export default connect(mapStateToProps)(RentalSearchListing)