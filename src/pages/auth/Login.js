import React from 'react'
import { Link } from "react-router-dom"

import { LoginForm } from '@/components/auth'

const Login = () => {
  return (
    <section className="auth d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h2 className="logo mb-5">PLAY<span>ternative</span></h2>
        <LoginForm />
      <div className="auth-footer w-25">
        <span>Don't have an account?</span>
        <Link className="link" to="register">Create an account!</Link>
      </div>
    </section>
  )
}

export default Login
