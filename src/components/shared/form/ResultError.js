import React from 'react'

export const ResultError = (props) => {
    const errors = props.errors;

    return(
        errors.length>0 &&
        <div className='alert alert-danger custom-res-errors'>
            {
                errors.map((error, index) => <p key={index}> {error.detail} </p>)
            }
        </div>
    );
}