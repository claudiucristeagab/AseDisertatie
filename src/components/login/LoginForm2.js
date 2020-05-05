import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { InputField } from 'components/shared/form/InputField'
import { ResultError } from 'components/shared/form/ResultError'
import * as validators from 'validators/validators';

const LoginForm2 = (props) => {
  const { handleSubmit, pristine, submitting, loginCallback, valid } = props;
  return (
    <div className="card">
        <article className="card-body">
            <h4 className="card-title text-center mb-4 mt-1">Sign in</h4>
            <hr/>
            <p className="text-success text-center">Welcome!</p>
            <form onSubmit={handleSubmit(loginCallback)}>
                <div className="form-group">
                    <div className="input-group">
                        <Field
                            name="email"
                            component="input"
                            type="email"
                            label="Email"
                            className="form-control"
                            validate={[validators.required, validators.email]}
                            component={InputField}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <Field
                            name="password"
                            component="input"
                            type="password"
                            label="Password"
                            className="form-control"
                            validate={[validators.required, validators.minLength(8), validators.maxLength(128)]}
                            component={InputField}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" disabled={!valid || pristine || submitting}>Login</button>
                </div>
                <p className="text-center"><a href="#" className="btn">Forgot password?</a></p>
            </form>
        </article>
    </div>
  );
}

export default reduxForm({
  form: 'loginForm'
})(LoginForm2)