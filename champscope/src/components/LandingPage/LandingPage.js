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
import Grid from "@material-ui/core/Grid";
import Logo from "../../components/Menu/Logo";

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
                fontSize: "4.5em",
            },
            subtitle1: {
                fontFamily: '"Roboto", "Cormorant Garamond", "sans-serif"',
                fontWeight: 400,
                fontSize: "1.5em",
            },
            subtitle2: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
            },
            caption: {
                fontFamily: '"Roboto","Cormorant Garamond", "sans-serif"',
                fontSize: "1em",
            },
            h6: {
                fontSize: "2em",
                fontWeight: 400,

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
                maxWidth: "70vw",
            },
            [theme.breakpoints.up("lg")]: {
                maxWidth: "60vw",
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
                        <Box p={1.5}></Box>
                        <Typography variant="h2">CITYSCOPE</Typography>
                        <Typography variant="h2">Champs-Élysées </Typography>
                        <Box p={3} />

                        {props.readyState ? (
                            <React.Fragment>
                                <LoadingSprite />
                                <Typography variant="caption">
                                    Loading CityScope...
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <div onClick={_enterButtonEvent}>
                                <EnterButton />
                            </div>
                        )}
                        <Box p={3} />

                        <Typography variant="subtitle1">
                            <b>
                                Virtual CityScope Champs-Élysées is an
                                interactive and immersive platform to explore
                                the future of Paris’ most important street.{" "}
                            </b>
                            CityScope Champs-Élysées is a tangible user
                            interface for urban planning and decision-making. It
                            was designed as part of an exhibition at the
                            Pavillon de l'Arsenal in Paris, France. The
                            exhibition, curated by PCA-STREAM, explores new
                            plans and future interventions for the Champs
                            Élysées Avenue. These plans include options for
                            reduced traffic, encouraged walkability, improved
                            cycling and pedestrian mobility, and improved access
                            to cultural landmarks and amenities along the
                            avenue. Due to COVID-19 and the forced shutdown of
                            the exhibition, we have decided to move this
                            exhibition online.
                        </Typography>
                        <Box p={3} />

                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6} lg={6}>
                                <Typography variant="h6">
                                    Virtual CityScope
                                </Typography>

                                <Box p={1} />
                                <Typography variant="caption">
                                    Ariel Noyman, Arnaud Grignard, Nicolas
                                    Ayoub, Tri Nguyen-Huu, Luis Alonso, Kent
                                    Larson
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <Typography variant="h6">
                                    CityScope Champs-Elysées
                                </Typography>
                                <Typography variant="caption">
                                    in Pavillon de l'Arsenal, Paris
                                </Typography>
                                <Box p={1} />
                                <div>
                                    <Typography variant="caption">
                                        Arnaud Grignard, Nicolas Ayoub, Luis
                                        Alonso, Ariel Noyman, Markus Elkatsha,
                                        Maggie Church, Kent Larson
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="caption">
                                        Gama Platform: Tri Nguyen-Huu (IRD),
                                        Patrick Taillandier (INRA), Alexis
                                        Drogoul (IRD)
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>

                        <Box p={2} />
                        <Logo />
                    </Box>
                </MuiThemeProvider>
                <Video />
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
