import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { connect } from 'react-redux'

import OverlayPage from '../assets/OverlayPage'

import Routes from '@/routes/index'
import Topbar from '@/containers/Topbar'

import { LoginForm } from '@/components/auth/'

import { authenticate } from '@/actions/index.js'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const Content = ({ user }) => {
  return (
    <section>
      <Topbar user={user} />
      <section className="p-4">
      <Routes user={user} />
      </section>
    </section>
  )
}

const Application = ({ user, authenticate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggle = () => setIsModalOpen(!isModalOpen)

  useLayoutEffect(() => {
    authenticate()
  }, [])

  useEffect(() => {
    if (!user) setIsModalOpen(true)
  }, [user])

  const closeBtn = <span style={{ fontSize: "1.3rem" }}><i style={{ color: '#D9308D', cursor: 'pointer' }} className="fas fa-times" onClick={toggle}></i></span>

  return (
    <>
    <OverlayPage />
    <section>
          <Modal className="login-modal p-4" isOpen={isModalOpen}>
            <ModalBody className="login-modal-body shadow">
            <div style={{ border: 'none'}} className="w-100 d-flex justify-content-end pr-4" close={closeBtn}>{closeBtn}</div>
              <section className="text-center">
                <h3 style={{ color: '#F2A71B' }} className="font-weight-bolder pb-2">Hello!</h3>
                <h5 style={{ color: '#F2D98D' }}>Sign up to enjoy more features!</h5>
              </section>
              <LoginForm className='w-100' />
            </ModalBody>
          </Modal>
      <Content user={user} />
    </section>
    </>
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
