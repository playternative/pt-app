import React from "react";
import classnames from 'classnames'

export const Button = (props) => {
  const { reversed, active } = props
  return (
    <span
    style={{
      color: active ? '#142240' : '#D9D9D9'
     }}
      className={classnames('editor-button mx-1' )} {...props} />
  )
}

export const Icon = ({ children }) => {

  if (!children.includes('fas')) {
    return (
      <span className="editor-icon">{children}</span>
    )
  } else {
    return (
      <span className="editor-icon">
        <i className={children}></i>
      </span>
    )
  }
}

export const Menu = (props) => {
  return (
    <div className="editor-menu" {...props} />
  )
}

export const Toolbar = (props) => {
  return (
    <Menu className="editor-toolbar" {...props} />
  )
}
