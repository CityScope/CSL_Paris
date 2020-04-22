import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { connect } from "react-redux";
import "./LandingPage.css";
import LoadingSprite from "../LandingPage/LoadingSprite";
import EnterButton from "../LandingPage/EnterButton";
import Box from "@material-ui/core/Box";
import Video from "./Video";
import { setStartSceneState } from "../../redux/actions";

function LandingPage(props) {
    const theme = createMuiTheme({
        overrides: {
            MuiCssBaseline: {
                "@global": {
                    "*": {
                        "scrollbar-width": "thin",
                    },
                    "*::-webkit-scrollbar": {
                        width: "4px",
                        height: "4px",
                    },
                },
            },
        },
        palette: {
            background: {
                default: "black",
            },
            color: {
                default: "#fff",
            },
        },
        typography: {
            h2: {
                fontFamily: ["Cormorant Garamond", "cursive"].join(","),
                fontWeight: 400,
                fontSize: "5em",
            },
            subtitle1: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontWeight: 300,
                fontSize: "1.5em",
            },
            subtitle2: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
            },
            caption: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "1em",
            },
            h6: {
                fontFamily: ["Cormorant Garamond", "cursive"].join(","),
            },
        },
    });

    const useStyles = makeStyles((theme) => ({
        box: {
            background: "none",
            color: "#fff",
            padding: theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
                maxWidth: "90vw",
            },
            [theme.breakpoints.up("md")]: {
                maxWidth: "50vw",
            },
            [theme.breakpoints.up("lg")]: {
                maxWidth: "50vw",
            },

            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
            maxHeight: "100vh",
            overflow: "auto",
        },
    }));

    const [startScene, setStartScene] = useState(false);

    function _enterButtonEvent(e) {
        e.preventDefault();
        // hook
        setStartScene(true);
        // redux the start
        props.setStartSceneState(true);
    }

    const classes = useStyles();

    if (!startScene) {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={theme}>
                    <Box className={classes.box}>
                        <CssBaseline />
                        <Box p={3}></Box>
                        <Typography variant="h2">CITYSCOPE</Typography>
                        <Typography variant="h2">Champs-Élysées </Typography>
                        <Box p={2}></Box>
                        {props.readyState ? (
                            <LoadingSprite />
                        ) : (
                            <div onClick={_enterButtonEvent}>
                                <EnterButton />
                            </div>
                        )}
                        <Box p={3}>
                            <Typography variant="subtitle1">
                                CityScope Champs-Élysées is a Tangible User
                                Interface for urban planning and
                                decision-making. It was designed and installed
                                as part of an exhibition in the Pavillon de
                                l'Arsenal, Paris. Composed by PCA-STREAM, this
                                exhibition explored new plans and future
                                interventions for Champs Élysées Avenue. These
                                include reduced traffic, encouraged walkability,
                                cycling and pedestrian movement, as well as
                                improved access to cultural landmarks and
                                amenities along the Avenue. Due to COVID-19, we
                                have decided to move this exhibition online.
                                This website allows users to explore MIT
                                CityScope Champs-Élysées in an interactive and
                                immersive way.
                            </Typography>
                        </Box>
                        <Box p={3} />
                        <Typography variant="h6">
                            Exhabition in Pavillon de l'Arsenal
                        </Typography>
                        <Box p={1} />
                        <div>
                            <div>
                                <Typography variant="caption">
                                    PCA-STREAM
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <div>
                                <Typography variant="caption">
                                    MIT City Science
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <div>
                                <Typography variant="caption">GAMA</Typography>
                            </div>
                        </div>

                        <Box p={3} />
                        <Typography variant="h6">
                            Virtual Champs-Élysées
                        </Typography>
                        <Box p={0.5} />
                        <Typography variant="caption">
                            Ariel Noyman, Arnaud Grignard, Nicolas Ayoub, Luis
                            Alonso, Kent Larson
                        </Typography>
                        <Box p={2} />
                    </Box>
                </MuiThemeProvider>
                <Video youtubeId={"MVhauHKiEPA"} />
            </React.Fragment>
        );
    } else {
        return null;
    }
}

const mapStateToProps = (state) => {
    return {
        readyState: state.LOADING,
    };
};

const mapDispatchToProps = {
    setStartSceneState: setStartSceneState,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
