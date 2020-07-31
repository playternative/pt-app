import React from 'react'
import { Redirect, Route, Switch } from "react-router-dom"

const PrivateRoute = ({ component: Component, user, ...otherProps }) => (
  <Route
    {...otherProps}
    render={(props) => (
      user
        ? <Component {...props} />
        : <Redirect to='/' />
    )}
  />
)

export default PrivateRoute
