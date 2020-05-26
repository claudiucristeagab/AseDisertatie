import React from 'react'
import { RentalList } from './RentalList'
import { connect } from 'react-redux';
import * as actions from 'actions';
import queryString from 'query-string';

class RentalSearchListing extends React.Component {

    constructor() {
        super();
        this.state = {
            searchedQuery: '',
            page: 1
        }
    }
    componentWillMount() {
        const searchQuery = queryString.parse(this.props.location.search).search;
        const page = queryString.parse(this.props.location.search).page;

        this.searchRentals(searchQuery, page);
    }

    componentDidUpdate() {
        const { searchedQuery, page } = this.state;

        const currentSearchQuery = queryString.parse(this.props.location.search).search;
        const currentPage = queryString.parse(this.props.location.search).page;

        if (currentSearchQuery !== searchedQuery || currentPage !== page) {
            this.searchRentals(currentSearchQuery, currentPage);
        }
    }

    searchRentals(searchQuery, page) {
        this.setState({
            searchedQuery: searchQuery,
            page: page
        });
        this.props.dispatch(actions.fetchRentals(searchQuery, null, page));
    }

    getPaginationComponent(page){
        return(
            <nav aria-label="...">
                    <ul class="pagination">
                        <li class="page-item disabled">
                            <a class="page-link" href="#" tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">page</a></li>
                        <li class="page-item">
                            <a class="page-link" href="#">Next</a>
                        </li>
                    </ul>
                </nav>
        )
    }

    render() {
        const { searchedQuery } = this.state;
        const { rentals, errors } = this.props;
        return (
            <section id='rentalListing'>
                {
                    searchedQuery &&
                    <h1 className='page-title'>Rentals in {searchedQuery}</h1>
                }
                {
                    errors.length > 0 &&
                    <h3 className='page-title'>{errors[0].detail}</h3>
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