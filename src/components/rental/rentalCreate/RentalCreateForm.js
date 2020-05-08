import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField } from 'components/shared/form/InputField';
import { FileUploadField } from 'components/shared/form/FileUploadField';
import { TextareaField } from 'components/shared/form/TextareaField';
import { SelectField } from 'components/shared/form/SelectField';
import { ResultError } from 'components/shared/form/ResultError';
// import { required, minLength4 } from 'components/shared/form/validators';

const RentalCreateForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid, options, errors } = props
    return (
        <form onSubmit={handleSubmit(submitCb)}>
            <div className='row'>
                <div className='col-md-5'>
                    <Field
                        name="title"
                        type="text"
                        label='Title'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="description"
                        type="text"
                        label='Description'
                        rows='6'
                        className='form-control'
                        component={TextareaField}
                    />
                    <Field
                        name="country"
                        type="text"
                        label='Country'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="city"
                        type="text"
                        label='City'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="street"
                        type="text"
                        label='Street'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="address"
                        type="text"
                        label='Address'
                        className='form-control'
                        component={InputField}
                    />
                </div>
                <div className='col-md-5'>
                    <Field
                        options={options}
                        name="category"
                        label='Category'
                        className='form-control'
                        component={SelectField}
                    />
                    <Field
                        name="bedrooms"
                        type="number"
                        label='Bedrooms'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="beds"
                        type="number"
                        label='Beds'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="guests"
                        type="number"
                        label='Guests'
                        className='form-control'
                        component={InputField}
                    />
                    <Field
                        name="dailyRate"
                        type="number"
                        label='Daily Rate'
                        className='form-control'
                        symbol='$'
                        component={InputField}
                    />
                    <Field
                        name="image"
                        label='Image'
                        component={FileUploadField}
                    />
                    <button className='btn btn-custom btn-form btn-block' type="submit" disabled={!valid || pristine || submitting}>
                        Create Rental
                    </button>
                </div>
            </div>
            <ResultError errors={errors} />
        </form>
    )
}

export default reduxForm({
    form: 'rentalCreateForm',
    initialValues: { shared: false, category: 'apartment', bedrooms: 1, beds: 1, guests: 1 }
})(RentalCreateForm)