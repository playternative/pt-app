import React from 'react'
import { IndexRoute, Switch, Route } from 'react-router-dom'

import { NoAuthRoute, PrivateRoute } from '@/components/application/index.js'

import AdminRoutes from './admin'

import {
  Login,
  Admin
} from '@/pages'

import Home from '@/pages/Home'

const Routes = props => {
  return (
      <Switch>
        <Route  exact path="/login" component={Login} {...props} />
        <Route exact path='/' component={Home} {...props} /> 

      // Admin Routes
      <PrivateRoute exact path='/admin' component={Admin} {...props}  />
      </Switch>
  )
}

export default Routes
