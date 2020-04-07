import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        button: {
            fontFamily: '"Open Sans", "sans-serif"',
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

export default function EnterButton() {
    const classes = useStyles();

    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
                <Button
                    style={{
                        borderColor: "#fff",
                        color: "white",
                        fontWeight: "bolder",
                    }}
                    variant="outlined"
                >
                    Enter CityScope
                </Button>
            </div>
        </MuiThemeProvider>
    );
}
