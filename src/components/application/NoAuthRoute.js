import React from 'react'
import { Redirect, Route } from "react-router-dom"

const NoAuthRoute = ({ component: Component, user, ...otherProps }) => (
  // If user exists redirect them to home route / else the component
  <Route
    {...otherProps}
    render={(props) => (
      user
        ? <Redirect to='/' />
        : <Component {...props} />
    )}
  />
)

export default NoAuthRoute
