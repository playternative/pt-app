import React from 'react'
import { connect } from "react-redux";
import { push } from 'connected-react-router'
import { Link } from "react-router-dom"
import { logout } from "../actions/index";

import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Dropdown
} from "reactstrap";

const Topbar = ({ user, push, logout }) => {

  console.log(user, 'user')

  return (
    <section className="pt-4">
      <section className="w-100 text-center position-absolute">
        <h2 className="nav-logo font-weight-bolder">
          <span className="nav-play">
            PLAY
        </span>
          <span style={{ color: '#F2D98D' }}>ternative</span></h2>
      </section>
      <Navbar className="top-bar">
        <Nav className="ml-auto mb-0 d-flex flex-column" navbar>
          <div className="text-center">
            {!user && (
              <>
                <Button className="top-bar-btn ">Sign Up</Button>
                <Button as={Link} href='/login' className="top-bar-btn ml-2">Log in</Button>
              </>
            )}
            {user && user.admin && (
              <Button onClick={() => push('/admin')} className="top-bar-btn">Admin</Button>
            )}
            {user && (
              <Button className="top-bar-btn ml-2" onClick={logout}>Logout</Button>
            )}
          </div>
        </Nav>
      </Navbar>
      {user && (
        <div style={{ color: '#F2D98D' }} className="d-flex flex-row justify-content-end">
          <span className="mt-2 mr-2">Logged in as {user.email || user.username}</span>
        </div>
      )}
    </section>
  )
}

export default connect(
  ({ app }) => ({
    loggedInUser: app.user
  }),
  {
    push,
    logout
  }
)(Topbar);