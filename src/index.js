import React from "react";
import ReactDOM from "react-dom";

import "semantic-ui-css/components/button.min.css";
import "semantic-ui-css/components/card.min.css";
import "semantic-ui-css/components/container.min.css";
import "semantic-ui-css/components/form.min.css";
import "semantic-ui-css/components/grid.min.css";
import "semantic-ui-css/components/icon.min.css";
import "semantic-ui-css/components/image.min.css";
import "semantic-ui-css/components/item.min.css";
import "semantic-ui-css/components/label.min.css";
import "semantic-ui-css/components/list.min.css";
import "semantic-ui-css/components/loader.min.css";
import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/modal.css";
import "semantic-ui-css/components/reveal.min.css";
import "semantic-ui-css/components/checkbox.min.css";
import "semantic-ui-css/components/statistic.min.css";
import "semantic-ui-css/components/segment.min.css";
import "semantic-ui-css/components/header.min.css";
import "semantic-ui-css/components/tab.min.css";
import "semantic-ui-css/components/table.min.css";
import "semantic-ui-css/components/step.min.css";
import "semantic-ui-css/components/sticky.min.css";
import "semantic-ui-css/components/shape.min.css";
import "semantic-ui-css/components/placeholder.min.css";
import "semantic-ui-css/components/nag.min.css";
import "semantic-ui-css/components/input.min.css";
import "semantic-ui-css/components/embed.min.css";
import "semantic-ui-css/components/dimmer.min.css";
import "semantic-ui-css/components/dropdown.min.css";

import "font-awesome/css/font-awesome.min.css"

import "react-toastify/dist/ReactToastify.css";
import "./app/layout/bootstrap.css";
import "./app/layout/styles.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "./app/store/configureStore";
import ScrollToTop from "./app/layout/ScrollToTop";
import { createBrowserHistory } from "history";
import { isReactDevMode } from "./app/common/util/util";
import mixpanel from 'mixpanel-browser';
import { MixpanelProvider } from 'react-mixpanel';


const MIXPANEL_DEV_TOKEN = "5b6675e2c4987ab7a8b010acab0a34ed"
const MIXPANEL_PROD_TOKEN = "a91637d7e894d98bd586823883ac17ca"

mixpanel.init(isReactDevMode() ? MIXPANEL_DEV_TOKEN : MIXPANEL_PROD_TOKEN, { "api_host": "https://api-eu.mixpanel.com" }, "");

export const history = createBrowserHistory();
export const store = configureStore(history, mixpanel);

const rootEl = document.getElementById("root");

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <MixpanelProvider mixpanel={mixpanel}>
      <ConnectedRouter history={history}>
        <ScrollToTop />
        <App mixpanel={mixpanel} />
      </ConnectedRouter>
      </MixpanelProvider>
    </Provider>,
    rootEl
  );
}

if (module.hot) {
  module.hot.accept("./app/layout/App", function () {
    setTimeout(render);
  });
}

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
