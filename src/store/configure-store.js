/* @flow */

import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { connectRoutes } from "redux-first-router";
import createHistory from "history/createBrowserHistory";

import { makeRootReducer } from "../reducers";
import { createAPIMiddleware } from "../middlewares/api";
import { box } from "../api/Box";
import { localStorage } from "../api/LocalStorage";
import { loadTabData, loadFileContent } from "../navigation-thunks";

const history = createHistory();
let prefix = "";
if (window.location.hostname === "floriancargoet.github.io") {
  prefix = "/fifty-editor";
}

const routesMap = {
  "URL/SELECT_TAB": {
    path: `${prefix}/:tab`,
    thunk: loadTabData
  },
  "URL/SELECT_FILE": {
    path: `${prefix}/:tab/:fileID`,
    thunk: loadFileContent,
    fromPath: (segment, key) => {
      console.log("from", segment, key);
      return decodeURIComponent(segment);
    }
    // /!\ do not encodeURIComponent, it creates double dispatches :'(
    // the browser will encode it by itself
  }
};

const {
  reducer: locationReducer,
  middleware: locationMiddleware,
  enhancer: locationEnhancer
} = connectRoutes(history, routesMap);

const loggerMiddleware = createLogger();
const apiMiddleware = createAPIMiddleware({
  APIByNamespace: {
    "DROPBOX/": box,
    "LS/": localStorage
  }
});

const middlewaresEnhancer = applyMiddleware(
  locationMiddleware,
  thunkMiddleware,
  apiMiddleware,
  loggerMiddleware
);

const enhancer = compose(locationEnhancer, middlewaresEnhancer);

const configureStore = function (initialState = {}) {
  const rootReducer = makeRootReducer(locationReducer);
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
      const nextMakeRootReducer = require("../reducers").makeRootReducer;
      store.replaceReducer(nextMakeRootReducer(locationReducer));
    });
  }
  return store;
};

export default configureStore;
