import React from 'react'
import { Redirect, Route } from "react-router-dom"

const PrivateRoute = ({ component: Component, user, ...otherProps }) => (
  // If user does not exist redirect to /login, else redirect to the component
  <Route
    {...otherProps}
    render={(props) => (
      user
        ? <Component {...props} />
        : <Redirect to='/login' />
    )}
  />
)

export default PrivateRoute
