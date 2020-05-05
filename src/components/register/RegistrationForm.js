import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { InputField } from 'components/shared/form/InputField'
import { ResultError } from 'components/shared/form/ResultError'
import * as validators from 'validators/validators';

const RegistrationForm = (props) => {
  const { handleSubmit, pristine, submitting, submitCallback, valid, errors } = props;
  return (
    <form onSubmit={handleSubmit(submitCallback)}>
        <Field
            name="username"
            type="text"
            label="Username"
            className="form-control"
            validate={[validators.required, validators.minLength(4), validators.maxLength(32)]}
            component={InputField}
        />
        <Field
            name="email"
            type="email"
            label="Email"
            className="form-control"
            validate={[validators.required, validators.email]}
            component={InputField}
        />
        <Field
            name="password"
            type="password"
            label="Password"
            className="form-control"
            validate={[validators.required, validators.minLength(8), validators.maxLength(128)]}
            component={InputField}
        />
        <Field
            name="passwordConfirmation"
            type="password"
            label="Confirm Password"
            className="form-control"
            validate={[validators.required, validators.minLength(8), validators.maxLength(128)]}
            component={InputField}
        />
        <div>
        <button className='btn btn-custom btn-form' type="submit" disabled={!valid || pristine || submitting}>
            Register
        </button>
        </div>
    </form>
  );
}

const validate = (values) => {
    const errors = {}

    if (values.password !== values.passwordConfirmation) {
        errors.passwordConfirmation = 'Passwords must match';
    }

    return errors;
}

export default reduxForm({
  form: 'registrationForm',
  validate: validate
})(RegistrationForm)    