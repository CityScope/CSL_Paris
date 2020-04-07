import React, { Component } from "react";
import ThreeScene from "./components/ThreeScene/ThreeScene";
import configureStore from "./redux/store";
import Provider from "./redux/Provider";
import LandingPage from "./components/LandingPage/LandingPage";

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <LandingPage />
                <ThreeScene />
            </Provider>
        );
    }
}
