import React, { Component } from "react";

import configureStore from "./redux/store";
import Provider from "./redux/Provider";
import LandingPage from "./components/LandingPage/LandingPage";
import ThreeWrapper from "./components/ThreeScene/ThreeWrapper";
import Audio from "./components/Audio";

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <div style={{ height: "100vh" }}>
                <Provider store={store}>
                    <LandingPage />
                    <ThreeWrapper />
                    <Audio />
                </Provider>
            </div>
        );
    }
}
