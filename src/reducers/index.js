import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { createTransform, persistReducer } from "redux-persist";
import { connectRouter } from "connected-react-router";

import app from "./app";

const rootPersistConfig = {
  key: "root",
  storage,
  transforms: [
  createTransform(
    ({ token }) => ({ token }),
    // transform state being rehydrated
    (state) => ({
      ...state,
      user: {
        ...state.token && {
          token: state.token
        }
      }
    }),
    { whitelist: ['app'] }
  )
],
  whitelist: ["app"],
};

const appPersistConfig = {
  key: "app",
  storage,
  whitelist: ["token"],
};

export default (history) =>
  persistReducer(
    rootPersistConfig,
    combineReducers({
      app: persistReducer(
   appPersistConfig,
   app
 ),
      router: connectRouter(history),
    })
  );
