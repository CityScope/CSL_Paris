import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InfoIcon from "@material-ui/icons/Info";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "*": {
                    "scrollbar-width": "thin",
                },
                "*::-webkit-scrollbar": {
                    width: "5px",
                    height: "10px",
                },
            },
        },
    },
    palette: {
        textPrimary: { main: "white" },
    },
    typography: {
        h2: {
            fontFamily: '"Cormorant Garamond", "sans-serif"',
            fontSize: "3em",
        },
        subtitle1: {
            fontFamily: '"Cormorant Garamond", "sans-serif"',
            fontSize: "1.5em",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    paper: {
        color: "white",
        background: "rgba(0,0,0,0.9)",
        marginBottom: "0em",
        overflow: "auto",
        padding: "3em",
    },
}));

export default function Info() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MuiThemeProvider theme={theme}>
            <div>
                <InfoIcon
                    type="button"
                    style={{ color: "white" }}
                    onClick={handleOpen}
                />
                <CssBaseline />
                <Dialog open={open} onClose={handleClose} id={"modal"}>
                    <Paper className={classes.paper}>
                        <Typography variant="h2">
                            CityScope Champs-Élysées
                        </Typography>
                        <Box p={3} />
                        <Typography variant="subtitle1">
                            <p>
                                A collaboration between PCA-STREAM and MIT Media
                                Lab City Science
                            </p>
                            CityScope Champs-Élysée is a Tangible User Interface
                            for urban planning and decision-making, that was
                            installed as part of an exhibition in Pavillon de
                            l'Arsenal, Paris. The exhibition by PCA-STREAM,
                            explored new plans and future interventions for
                            Champs Élysées Boulevard. These include reduced
                            traffic, encouraged walkability, cycling and
                            pedestrian movement in the famous street. As well,
                            the project suggested improved access to cultural
                            landmarks and amenities along the Boulevard. Due to
                            COVID19, we have decided to move this exhibition
                            online. This website allow users to explore MIT
                            CityScope Champs-Élysée in an interactive and
                            immersive way.
                        </Typography>
                        <Box p={3} />
                        <Typography variant="subtitle1">
                            <p>
                                <b>
                                    <u>CityScope Champs-Elysées</u>
                                </b>
                            </p>
                            <p>
                                CityScope is developed by City Science - MIT
                                Media Lab www.media.mit.edu/groups/city-science
                                github.com/CityScope/cityscope.github.io
                            </p>
                            <p>
                                Gama Platform is developed by the l’IRD/UMMISCO
                                and its partners gama-platform.github.io
                            </p>
                            <p>
                                <b>MIT City Science Team:</b>
                            </p>
                            <p>
                                Arnaud Grignard, Nicolas Ayoub, Luis Alonso,
                                Ariel Noyman, Markus Elkatsha, Maggie Church,
                                Kent Larson
                            </p>
                            <p>
                                <b>Gama Platform Team:</b>
                                Tri Nguyen-Huu (IRD), Patrick Taillandier
                                (INRA), Alexis Drogoul (IRD)
                            </p>
                            <b>
                                <u>Virtual CityScope Champs-Elysées</u>
                            </b>
                            <p>Developed by MIT Media Lab City Science</p>
                            <p>
                                Virtual Champs Elysées is a virtual
                                representation of the physical CityScope
                                Champs-Elysées deployed at the Pavillon de
                                l'Arsenal.
                            </p>
                            Ariel Noyman, Arnaud Grignard, Nicolas Ayoub, Luis
                            Alonso, Tri Nguyen-Huu, Kent Larson
                        </Typography>
                    </Paper>
                </Dialog>
            </div>
        </MuiThemeProvider>
    );
}
