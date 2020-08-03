import React, { useEffect } from 'react'

import { connect } from 'react-redux'

import Routes from '@/routes/index'
import Topbar from '@/containers/Topbar'

import { authenticate } from '@/actions/index.js'

const Content = ({ user }) => {
  return (
    <main>
        <Topbar loggedInUser={user} />
      <section>
        <Routes user={user}  />
      </section>
    </main>
  )
}

const Application = ({ user, authenticate }) => {

  useEffect(() => {
    authenticate()
  }, [])

  return (
     <Content user={user} />
  )
}


export default connect(
  ({ app }) => ({
    user: app.user,
  }),
  {
    authenticate,
  }
)(Application)
