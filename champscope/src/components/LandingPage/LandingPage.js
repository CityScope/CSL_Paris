import React from "react";
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

const theme = createMuiTheme({
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
    },
    box: {
        borderColor: "white !important",
        marginTop: "15vh",
        background: "none",
        color: "#fff",
        padding: theme.spacing(3),
        minWidth: "30vw",
        maxWidth: "50vw",
        textAlign: "center",
        rounded: true,
        margin: "0 auto",
    },
}));

function LandingPage(props) {
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>
                <Box className={classes.box}>
                    <Typography variant="h2">
                        CityScope Champs-Élysées
                    </Typography>

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

                    {props.readyState ? <LoadingSprite /> : <EnterButton />}

                    <Box p={2}>
                        <Typography variant="h6">
                            Pavillon de l'Arsenal
                        </Typography>

                        <Box p={0}>
                            <Typography variant="caption">
                                PCA Stream
                            </Typography>
                        </Box>

                        <Typography variant="caption">
                            name name, name name, name name
                        </Typography>

                        <Box p={0}>
                            <Typography variant="caption">
                                MIT City Science
                            </Typography>
                        </Box>

                        <Typography variant="caption">
                            Arnaud Grignard, Nicolas Ayoub, Luis Alonso, Ariel
                            Noyman, Markus Elkatsha, Kent Larson
                        </Typography>

                        <Box p={0}>
                            <Typography variant="caption">
                                Gama Platform
                            </Typography>
                        </Box>

                        <Typography variant="caption">
                            Tri Nguyen-Huu (IRD) Patrick Taillandier (INRA)
                            Alexis Drogoul (IRD)
                        </Typography>
                        <Box p={2}>
                            <Typography variant="h6">
                                Virtual Champs-Élysées
                            </Typography>
                            <Typography variant="caption">
                                Ariel Noyman, Arnaud Grignard, Nicolas Ayoub,
                                Kent Larson
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Video youtubeId={"MVhauHKiEPA"} />
            </div>
        </MuiThemeProvider>
    );
}

const mapStateToProps = (state) => {
    return {
        readyState: state.LOADING,
    };
};

export default connect(mapStateToProps, null)(LandingPage);
