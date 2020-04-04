import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
        position: "fixed",
        fontFamily: " Arial, Helvetica, sans-serif",
        top: 0,
        left: 0,
    },
}));

export default function LandingPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CircularProgress />
            <div>
                <h1>HIDE ME WHEN DONE LOADING...</h1>
            </div>
        </div>
    );
}
