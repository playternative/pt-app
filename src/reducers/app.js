import { handleActions } from 'redux-actions'

import { setToken, setUser } from '@/actions/index.js'

const initialState = {
  token: null,
  user: null,
}

export default handleActions(
  {
    [setToken]: (state, { payload: token }) => ({
      ...state,
      token,
    }),
    [setUser]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
  },
  initialState
)
