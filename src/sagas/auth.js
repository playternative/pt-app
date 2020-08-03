import jwt_decode from 'jwt-decode'
import { put, putResolve, select, takeLatest } from "redux-saga/effects"

import { replace, push } from "connected-react-router"

import {
  setUser,
  authenticate,
  login,
  logout,
  setToken
} from '../actions/index'

import _ from 'lodash'

export default function* () {

  yield takeLatest(authenticate, function* () {
    let token = yield select(({ app }) => app.token)

    if (token) {
      const decode = jwt_decode(token)
      yield put(setUser(decode))
      yield put(push('/'))
    }
  })

  yield takeLatest(login, function* ({ payload: { e, user, userLoggedIn } }) {
    e.preventDefault()

    const newUser = yield userLoggedIn({
      variables: { login: user }
    });

    if (newUser.data.login.token !== null) {
      yield put(setToken(newUser.data.login.token))
      yield put(authenticate())
    }
  })

  yield takeLatest(logout, function* () {
    yield put(setToken(null))
    yield put(setUser(null))
    yield put(push('/'))
  })
}
