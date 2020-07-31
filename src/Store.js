import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import createRootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const history = createBrowserHistory();


const middleware = [routerMiddleware(history), sagaMiddleware];

export default () => {
  let store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(...middleware))
  );
  let persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
