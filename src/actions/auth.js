import { createAction } from "redux-actions"

export const authenticate = createAction("AUTHENTICATE")
export const logout = createAction("LOGOUT")
export const setToken = createAction("SET_TOKEN")
export const login = createAction("LOGIN")
