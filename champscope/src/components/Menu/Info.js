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
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </Typography>
                    </Paper>
                </Dialog>
            </div>
        </MuiThemeProvider>
    );
}
