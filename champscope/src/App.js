import React, { Component } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import Menu from "./components/Menu/Menu";
import ThreeScene from "./components/ThreeScene/ThreeScene";
import { connect } from "react-redux";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

/**
 * 
 <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-164555260-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-164555260-1');
</script>

 
 */

class App extends Component {
    componentDidMount() {
        ReactGA.initialize("UA-164555260-1", {
            debug: false,
            siteSpeedSampleRate: 100,
        });
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>"CityScope Champs-Élysées"</title>
                    <meta
                        name="description"
                        content="Virtual CityScope Champs-Élysées is an interactive and immersive platform to explore the future of Paris’ most important street."
                    />
                    <meta
                        name="og:url"
                        content="http://rechamp.media.mit.edu/"
                    />
                    <meta name="og:title" content="CityScope Champs-Élysées" />
                    <meta
                        name="og:description"
                        content="Virtual CityScope Champs-Élysées is an interactive and immersive platform to explore the future of Paris’ most important street."
                    />
                    <meta
                        name="og:image"
                        content="https://raw.githubusercontent.com/CityScope/CSL_Paris/master/champscope/header.jpg"
                    />
                    <meta name="og:type" content="website" />
                </Helmet>

                <ThreeScene menuInteraction={this.props.menuInteraction} />
                {this.props.showMenu ? <Menu /> : null}
                <LandingPage />
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

export default connect(mapStateToProps, null)(App);
