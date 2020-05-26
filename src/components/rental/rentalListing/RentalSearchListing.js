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
        const { searchedQuery, page } = this.state;
        // searchedQuery = queryString.parse(this.props.location.search).search;
        // page = queryString.parse(this.props.location.search).page || page;
        this.searchRentals(searchedQuery, page);
    }

    componentDidUpdate() {
        const { searchedQuery, page } = this.state;

        const currentSearchQuery = queryString.parse(this.props.location.search).search;
        const currentPage = queryString.parse(this.props.location.search).page || 1;

        if (currentSearchQuery !== searchedQuery || currentPage !== page) {
            this.searchRentals(currentSearchQuery, currentPage);
        }
    }

    searchRentals(searchedQuery, page) {
        this.setState({
            searchedQuery: searchedQuery,
            page: page
        });
        this.props.dispatch(actions.fetchRentals(searchedQuery, page));
    }

    goToPage(searchedQuery, page) {
        const { history } = this.props;

        let bigString = '/rentals';
        if (!!searchedQuery || !!page) {
            bigString += '?';
            let queryComponents = [];
            if (searchedQuery) {
                queryComponents.push(`search=${searchedQuery}`);
            }
            if (page) {
                queryComponents.push(`page=${page}`);
            }
            bigString += queryComponents.join("&");
            history.push(bigString);
        }
        else {
            history.push(bigString);
        }
    }

    getPaginationComponent(searchedQuery, page, rentalCount) {
        console.log(page);
        return (
            <div className="d-flex justify-content-center mt-4">
                <nav aria-label="...">
                    <ul className="pagination">
                        {
                            (page > 1) &&
                            <li className="page-item">
                                <a className="page-link" onClick={() => this.goToPage(searchedQuery, +page - 1)}>Previous</a>
                            </li>
                        }
                        <li className="page-item"><a className="page-link">{page}</a></li>
                        {
                            (rentalCount > 0) &&
                            <li className="page-item">
                                <a className="page-link" onClick={() => this.goToPage(searchedQuery, +page + 1)}>Next</a>
                            </li>
                        }
                    </ul>
                </nav>
            </div>

        )
    }

    render() {
        const { searchedQuery, page } = this.state;
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
                {this.getPaginationComponent(searchedQuery, page, rentals.length)}
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