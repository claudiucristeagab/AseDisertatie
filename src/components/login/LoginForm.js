import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { InputField } from 'components/shared/form/InputField'
import { ResultError } from 'components/shared/form/ResultError'
import * as validators from 'validators/validators';

const LoginForm = (props) => {
  const { handleSubmit, pristine, submitting, loginCallback, valid, errors } = props;
  return (
    <form onSubmit={handleSubmit(loginCallback)}>
        <Field
            name="email"
            component="input"
            type="email"
            label="Email"
            className="form-control"
            validate={[validators.required, validators.email]}
            component={InputField}
        />
        <Field
            name="password"
            component="input"
            type="password"
            label="Password"
            className="form-control"
            validate={[validators.required, validators.minLength(8), validators.maxLength(128)]}
            component={InputField}
        />
        <div>
        <button className='btn btn-custom btn-form' type="submit" disabled={!valid || pristine || submitting}>
            Login
        </button>
        <ResultError errors={errors}/>
        </div>
    </form>
  );
}

export default reduxForm({
  form: 'loginForm'
})(LoginForm)