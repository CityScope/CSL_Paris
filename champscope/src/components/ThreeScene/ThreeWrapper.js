import Menu from "../Menu/Menu";
import React, { Component } from "react";
import ThreeScene from "./ThreeScene";
import { connect } from "react-redux";

class ThreeWrapper extends Component {
    render() {
        return (
            <React.Fragment>
                <ThreeScene
                    menuInteraction={true}
                    // {this.props.menuInteraction}
                />
                {/* {this.props.startScene ? <Menu /> : null}  */}

                <Menu />
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
