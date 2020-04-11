import Menu from "../Menu/Menu";
import React, { Component } from "react";
import ThreeScene from "./ThreeScene";
import { connect } from "react-redux";
import Audio from "../Audio";

class ThreeWrapper extends Component {
    render() {
        return (
            <React.Fragment>
                <Menu />
                {/* <ThreeScene menuInteraction={this.props.menuInteraction} /> */}
                {/* {this.props.startScene ? <Menu /> : null}  */}
                {/* <Audio play={this.props.startScene} /> */}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menuInteraction: state.MENU_INTERACTION,
        startScene: state.START_SCENE,
    };
};

export default connect(mapStateToProps, null)(ThreeWrapper);
