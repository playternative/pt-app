import React, { useState } from 'react'
import { connect } from "react-redux";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import classnames from 'classnames'

import {
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";

import { login } from "../../actions/index";

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

const LoginForm = ({ className, login }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [userLoggedIn] = useMutation(LOGIN);

  const handleChange = event => {
    event.preventDefault();
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Form
      className={classnames('auth-form d-flex flex-column justify-content-center align-items-center p-4', className )}
      onSubmit={e =>
        login({ e: e, user: user, userLoggedIn: userLoggedIn })
      }
    >
      <FormGroup className="w-100">
        <Input
          value={user.email}
          onChange={handleChange}
          className="auth-input my-3"
          type="email"
          name="email"
          placeholder="Email"
        />
        <Input
          value={user.password}
          onChange={handleChange}
          className="auth-input my-3"
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button block type="submit" color="primary" className="auth-button my-2">
          <span>
            Login
          <i className="ml-3 fas fa-sign-in-alt"></i>
          </span>
        </Button>
      </FormGroup>
    </Form>
  )
}

export default connect(
  ({ }) => ({}),
  {
    login
  }
)(LoginForm);