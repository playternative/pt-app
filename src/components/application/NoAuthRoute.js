import React from 'react'
import { Redirect, Route, Switch } from "react-router-dom"

const NoAuthRoute = ({ component: Component, user, ...otherProps }) => (
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
