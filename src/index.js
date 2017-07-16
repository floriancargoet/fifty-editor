import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import configureStore from "./store/configure-store";
import App from "./App";
import { unregister } from "./registerServiceWorker";
unregister();

const store = configureStore();

// select a tab if not already done
if (store.getState().location.payload.tab == null) {
  store.dispatch({ type: "URL/SELECT_TAB", payload: { tab: "local" } });
}

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
