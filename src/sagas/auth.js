import jwt_decode from 'jwt-decode'
import { put, putResolve, select, takeLatest } from "redux-saga/effects"

import { replace, push } from "connected-react-router"

import {
    setUser,
    authenticate
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
}
