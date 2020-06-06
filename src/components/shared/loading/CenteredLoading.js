import React from 'react';
import Loader from 'react-loader-spinner'

export const CenteredLoading = () => {
    return (
        <div className="d-flex justify-content-center">
            <Loader type="TailSpin" color="#49cf81" height={80} width={80} />
        </div>
    );
}

export default CenteredLoading;