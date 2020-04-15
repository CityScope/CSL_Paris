import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Provider from "./redux/Provider";

import configureStore from "./redux/store";
const store = configureStore();

const root = document.getElementById("root");
const render = () => {
    return ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,

        root
    );
};

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        render(NextApp);
    });
}
