import React, { Component } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import Menu from "./components/Menu/Menu";
import ThreeScene from "./components/ThreeScene/ThreeScene";
import { connect } from "react-redux";
// import ThreeWrapper from "./components/ThreeScene/ThreeWrapper";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                {/* <ThreeScene menuInteraction={this.props.menuInteraction} /> */}
                {/* {this.props.showMenu ? <Menu /> : null} */}
                <Menu />
                {/* <LandingPage /> */}
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

export default connect(mapStateToProps, null)(App);
