import React, { Component } from "react";
import ThreeScene from "./components/ThreeScene/ThreeScene";

export default class App extends Component {
    render() {
        return (
            <div>
                <h1
                    style={{
                        color: "white",
                        zIndex: 1,
                        position: "fixed",
                        top: "0.5em",
                        left: "0.5em",
                        fontFamily: " Arial, Helvetica, sans-serif"
                    }}
                >
                    ChampScope
                </h1>
                <ThreeScene />;
            </div>
        );
    }
}
