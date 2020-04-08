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
            default: "none",
        },
        color: {
            default: "#fff",
        },
    },
    typography: {
        h2: {
            fontFamily: ["Petit Formal Script", "cursive"].join(","),
        },
        subtitle1: {
            fontFamily: '"Open Sans", "sans-serif"',
        },
        subtitle2: {
            fontFamily: '"Open Sans", "sans-serif"',
        },
        caption: {
            fontFamily: '"Open Sans", "sans-serif"',
        },
        h6: {
            fontFamily: ["Petit Formal Script", "cursive"].join(","),
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

        display: "flex",
        flexWrap: "wrap",
    },
    box: {
        borderColor: "white !important",
        background: "none",
        color: "#fff",
        padding: theme.spacing(3),

        [theme.breakpoints.down("sm")]: {
            maxWidth: "95vw",
        },
        [theme.breakpoints.up("md")]: {
            maxWidth: "75vw",
        },
        [theme.breakpoints.up("lg")]: {
            maxWidth: "50vw",
        },

        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
        maxHeight: "90vh",
        overflow: "auto",
    },
}));

function LandingPage(props) {
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
            <MuiThemeProvider theme={theme}>
                <Box className={classes.box}>
                    <CssBaseline />
                    <Box p={5}></Box>
                    <Typography variant="h2">CityScope</Typography>
                    <Typography variant="h2">Champs-Élysées </Typography>
                    <Box p={2}></Box>

                    {props.readyState ? (
                        <LoadingSprite />
                    ) : (
                        <div onClick={_enterButtonEvent}>
                            <EnterButton />
                        </div>
                    )}

                    <Box p={5}>
                        <Typography variant="subtitle1">
                            CityScope Champs-Élysées is an interactive platform
                            to improve decision-making related to the
                            revitalization of the Champs Élysées CityScope
                            Champs-Élysée is a tangible interface that explores
                            the experimental articulation between the diagnosis
                            of existing conditions and the proposed
                            interventions of PCA-STREAM for the Champs Élysées
                            in 2024. The project, exposed at the Pavillon de
                            l'Arsenal, illustrates interventions on the use of
                            new mobility, the strengthening of nature along the
                            avenue and finally the creation of new dynamic and
                            modular spaces in the city.
                        </Typography>
                    </Box>

                    <Box p={2}>
                        <Typography variant="h6">
                            Pavillon de l'Arsenal (??)
                        </Typography>

                        <Typography variant="caption">[PCA Stream] </Typography>

                        <Typography variant="caption">
                            name name, name name, name name{" "}
                        </Typography>

                        <Typography variant="caption">
                            [MIT City Science]{" "}
                        </Typography>

                        <Typography variant="caption">
                            Arnaud Grignard, Nicolas Ayoub, Luis Alonso, Ariel
                            Noyman, Markus Elkatsha, Kent Larson{" "}
                        </Typography>

                        <Typography variant="caption">
                            [Gama Platform]{" "}
                        </Typography>

                        <Typography variant="caption">
                            Tri Nguyen-Huu (IRD) Patrick Taillandier (INRA)
                            Alexis Drogoul (IRD)
                        </Typography>
                    </Box>

                    <Box p={2}>
                        <Typography variant="h6">
                            Virtual Champs-Élysées (??)
                        </Typography>
                        <Typography variant="caption">
                            Ariel Noyman, Arnaud Grignard, Nicolas Ayoub, Kent
                            Larson
                        </Typography>
                    </Box>

                    <Video youtubeId={"MVhauHKiEPA"} />
                </Box>
            </MuiThemeProvider>
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
