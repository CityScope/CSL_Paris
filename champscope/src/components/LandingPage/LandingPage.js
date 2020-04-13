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
import AppleIcon from "@material-ui/icons/Apple";

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
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Typography>
                        </Box>
                        <Box p={3} />
                        <Typography variant="h6">
                            Exhabition in Pavillon de l'Arsenal
                        </Typography>
                        <Box p={1} />
                        <div>
                            <AppleIcon />
                            <div>
                                <Typography variant="caption">PCA</Typography>
                            </div>
                        </div>
                        <div>
                            <AppleIcon />
                            <div>
                                <Typography variant="caption">GAMA</Typography>
                            </div>
                        </div>
                        <div>
                            <AppleIcon />
                            <div>
                                <Typography variant="caption">
                                    MIT City Science
                                </Typography>
                            </div>
                        </div>
                        <Box p={3} />
                        <Typography variant="h6">
                            Virtual Champs-Élysées
                        </Typography>
                        <Box p={1} />
                        <Typography variant="caption">
                            Ariel Noyman, Arnaud Grignard, Nicolas Ayoub, Luis
                            Alonso, Kent Larson
                        </Typography>
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
