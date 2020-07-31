import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { NoAuthRoute, PrivateRoute } from '@/components/application/index.js'

import Home from '@/pages/Home'

const Routes = props => {
  return (
    <section>
      <Switch>
        <Route exact path='/' component={Home} {...props} />
      </Switch>
    </section>
  )
}

export default Routes
