import Menu from "../Menu/Menu";
import React, { Component } from "react";
import ThreeScene from "./ThreeScene";

export default class ThreeWrapper extends Component {
    render() {
        return (
            <React.Fragment>
                <Menu />
                <ThreeScene />
            </React.Fragment>
        );
    }
}
