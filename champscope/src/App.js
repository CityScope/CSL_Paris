import React, { Component } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import Menu from "./components/Menu/Menu";
import ThreeScene from "./components/ThreeScene/ThreeScene";
import { connect } from "react-redux";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <ThreeScene menuInteraction={this.props.menuInteraction} />
                {/* {this.props.showMenu ? <Menu /> : null} */}
                <Menu />
                {/* <LandingPage /> */}
                {/* <div
                    style={{
                        pointerEvents: "none",
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "transparent",
                        opacity: 0.2,
                    }}
                >
                    <h1
                        style={{
                            fontSize: "15em",
                            backgroundColor: "rgba(0,0,0,0)",

                            textShadow:
                                "-3px -3px 0 #FFF, 3px -3px 0 #FFF, -3px 3px 0 #FFF, 3px 3px 0 #FFF",
                        }}
                    >
                        DRAFT
                    </h1>
                </div> */}
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
