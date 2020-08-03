import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from 'connected-react-router'
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { login, logout } from "../actions/index.js";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Dropdown
} from "reactstrap";

const LOGIN = gql`
  mutation login($login: LoginInput!) {
    login(input: $login) {
      id
      email
      token
      admin
    }
  }
`;

const Topbar = ({ loggedInUser, login, logout, push }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const history = useHistory();

  const [userLoggedIn] = useMutation(LOGIN);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleChange = event => {
    event.preventDefault();
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  return (
    <section>
      <Navbar className="main-navbar" expand="md">
        <NavbarBrand style={{ fontSize: "1.4rem", color: "#58A689" }} href="/">
          <span
            className="font-weight-bolder"
            style={{ color: "#088C37", fontSize: "2rem", letterSpacing: "1px" }}
          >
            PLAY
          </span>
          ternative
        </NavbarBrand>
        <Nav className="ml-auto mb-0 d-flex flex-column" navbar>
          <div className="text-center">
            {loggedInUser ? (
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle color="light">
                  <i class="fas fa-1x fa-user"></i>
                  <DropdownMenu className="text-center mt-1" right>
                    {loggedInUser.admin && (
                      <>
                        <DropdownItem disabled style={{ color: "red" }}>
                          Adminstrator
                        </DropdownItem>
                        <DropdownItem onClick={() => push('/admin')}>Admin Panel</DropdownItem>
                      </>
                    )}
                    <DropdownItem disabled>{loggedInUser.email}</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem onClick={logout}>Logout</DropdownItem>
                  </DropdownMenu>
                </DropdownToggle>
              </Dropdown>
            ) : (
              <>
                <Form
                  onSubmit={e =>
                    login({ e: e, user: user, userLoggedIn: userLoggedIn })
                  }
                >
                  <FormGroup className="m-0 d-flex">
                    <Input
                      value={user.email}
                      onChange={handleChange}
                      className="mr-1"
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    <Input
                      value={user.password}
                      onChange={handleChange}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <Button type="submit" color="primary" className="ml-2">
                      <i className="ml-2" class="fas fa-sign-in-alt"></i>
                    </Button>
                  </FormGroup>
                </Form>
                <NavbarText>
                  Don't have an account? <a>Sign Up!</a>
                </NavbarText>
              </>
            )}
          </div>
        </Nav>
      </Navbar>
    </section>
  );
};

export default connect(
  ({ app }) => ({
    loggedInUser: app.user
  }),
  {
    push,
    login,
    logout
  }
)(Topbar);
