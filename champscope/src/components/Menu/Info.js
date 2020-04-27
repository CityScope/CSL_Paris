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

        h3: {
            fontFamily: '"Cormorant Garamond", "sans-serif"',
            fontSize: "2em",
        },
        subtitle1: {
            fontFamily: '"Roboto","Cormorant Garamond", "sans-serif"',
            fontSize: "1.25em",
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
                        <Typography variant="subtitle1">
                            <p>
                                <Typography variant="h3">
                                    CityScope Champs-Elysées
                                </Typography>
                            </p>
                            <p>
                                MIT City Science Team: Arnaud Grignard, Nicolas
                                Ayoub, Luis Alonso, Ariel Noyman, Markus
                                Elkatsha, Maggie Church, Kent Larson
                            </p>
                            <p>
                                Gama Platform Team: Tri Nguyen-Huu (IRD),
                                Patrick Taillandier (INRA), Alexis Drogoul (IRD)
                            </p>
                            <Typography variant="h3">
                                Virtual CityScope Champs-Elysées
                            </Typography>
                            <p>
                                Ariel Noyman, Arnaud Grignard, Nicolas Ayoub,
                                Luis Alonso, Tri Nguyen-Huu, Kent Larson
                            </p>
                            <Box p={3} />
                        </Typography>
                    </Paper>
                </Dialog>
            </div>
        </MuiThemeProvider>
    );
}
