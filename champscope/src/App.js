import React, { Component } from "react";
import ThreeScene from "./components/ThreeScene/ThreeScene";
import configureStore from "./redux/store";
import Provider from "./redux/Provider";
import LandingPage from "./components/LandingPage/LandingPage";
import Menu from "./components/Menu/Menu";

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <div style={{ height: "100vh" }}>
                <Provider store={store}>
                    <Menu />
                    <LandingPage />
                    <ThreeScene />
                </Provider>
            </div>
        );
    }
}
