import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from 'services/authService';

export const ProtectedRoute = (props) => {
    const { component: Component, ...rest } = props;
    const { pathname } = rest.location;
    const isAuthenticated = authService.isAuthenticated();
    return (
        <Route {...rest} render={(props) => isAuthenticated
                                            ? <Component {...props} {...rest}/>
                                            : <Redirect to={{
                                                pathname:'/login',
                                                state: {initialPath: pathname}
                                            }}/>}/>
    )
}