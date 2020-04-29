import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { InputField } from 'components/shared/form/InputField'
import { ResultError } from 'components/shared/form/ResultError'

const RegistrationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, submitCallback, valid, errors } = props;
  return (
    <form onSubmit={handleSubmit(submitCallback)}>
        <Field
            name="username"
            component="input"
            type="text"
            label="Username"
            className="form-control"
            component={InputField}
        />
        <Field
            name="email"
            component="input"
            type="email"
            label="Email"
            className="form-control"
            component={InputField}
        />
        <Field
            name="password"
            component="input"
            type="password"
            label="Password"
            className="form-control"
            component={InputField}
        />
        <Field
            name="passwordConfirmation"
            component="input"
            type="password"
            label="Confirm Password"
            className="form-control"
            component={InputField}
        />
        <div>
        <button className='btn btn-custom btn-form' type="submit" disabled={!valid || pristine || submitting}>
            Register
        </button>
        <ResultError errors={errors}/>
        </div>
    </form>
  );
}

const validate = (values) => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Username required';
    } else if (values.username.length < 4) {
        errors.username = 'Username needs to be at least 4 characters';
    }

    if (!values.email) {
        errors.email = 'Email required';
    }

    if (!values.passwordConfirmation) {
        errors.passwordConfirmation = 'Please confirm your password';
    }

    if (values.password !== values.passwordConfirmation) {
        errors.password = 'Passwords must match';
    }

    return errors;
}

export default reduxForm({
  form: 'simple',
  validate: validate
})(RegistrationForm)