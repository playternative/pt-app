import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { connectRouter } from "connected-react-router";

import app from "./app";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["app"],
};

export default (history) =>
  persistReducer(
    rootPersistConfig,
    combineReducers({
      app,
      router: connectRouter(history),
    })
  );
