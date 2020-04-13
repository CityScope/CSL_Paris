import Menu from "../Menu/Menu";
import React, { Component } from "react";
import ThreeScene from "./ThreeScene";
import { connect } from "react-redux";

class ThreeWrapper extends Component {
    render() {
        return (
            <React.Fragment>
                {/* <ThreeScene menuInteraction={this.props.menuInteraction} /> */}
                {/* {this.props.showMenu ? <Menu /> : null} */}
                {/* <Menu /> */}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menuInteraction: state.MENU_INTERACTION,
        showMenu: state.START_SCENE,
    };
};

export default connect(mapStateToProps, null)(ThreeWrapper);
