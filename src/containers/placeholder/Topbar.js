import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from 'connected-react-router'
import { Link } from "react-router-dom"
import { logout } from "../../actions/index.js";

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

const Topbar = ({ user, logout, push }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  console.log(user, 'user')

  return (
    <section>
      <Navbar className="top-bar" expand="md">
        <NavbarBrand href="/">
          <h2 className="logo">PLAY<span>ternative</span></h2>
        </NavbarBrand>
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
        <div className="d-flex flex-row justify-content-end">
          <span className="mt-2 mr-2">Logged in as {user?.email || user?.username}</span>
        </div>
      )}
    </section>
  );
};

export default connect(
  ({ app }) => ({
    loggedInUser: app.user
  }),
  {
    push,
    logout
  }
)(Topbar);
