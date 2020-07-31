import { all } from "redux-saga/effects"

import authSagas from "./auth"


export default function* rootSaga(context) {
  yield all([
    authSagas(context),
  ])
}
