import React from 'react';
import { connect } from 'react-redux';

class Profile extends React.Component {

}

const mapStateToProps = state => {
    return {
        reviews: state.reviews.data,
        isLoading: state.reviews.isLoading
    }
}

export default connect(mapStateToProps)(Profile)
