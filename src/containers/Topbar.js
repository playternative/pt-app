import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { push } from "connected-react-router"
import { setToken } from "../actions/index.js"


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

const Topbar = ({ setToken, loggedInUser, push }) => {
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

  const handleSubmit = async (e, input) => {
    e.preventDefault();
    const newUser = await userLoggedIn({
      variables: { login: input }
    });
    if (newUser.data.login.token !== null) {
       setToken(newUser.data.login.token)
       history.push("/")
    }
  };

  return (
    <section>
      <Navbar color="light" light expand="md">
        <NavbarBrand style={{ fontSize: "1.4rem" }} href="/">
          <span
            className="font-weight-bolder"
            style={{ color: "#5ABF86", fontSize: "2rem", letterSpacing: "1px" }}
          >
            PLAY
          </span>
          ternative
        </NavbarBrand>
        <Nav className="ml-auto mb-0 d-flex flex-column" navbar>
          <div className="text-center">
            <Form onSubmit={e => handleSubmit(e, user)}>
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
                  <i className="fas fa-sign-in-alt"></i>
                </Button>
              </FormGroup>
            </Form>
            {userLoggedIn && (
              <NavbarText>
                Don't have an account? <a>Sign Up!</a>
              </NavbarText>
            )}
          </div>
        </Nav>
      </Navbar>
    </section>
  );
};

export default connect(
    ({}) => ({}),
    {
      push,
      setToken
    }
)(Topbar)
