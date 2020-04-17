import React from "react";
import "./OverlayMertics.scss";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// ! https://codepen.io/rishatmuhametshin/pen/BWRzGB

const useStyles = makeStyles({
    root: {
        width: "10em",
    },
});

export default function OverlayMertics() {
    const classes = useStyles();
    const [showMetrics, setValue] = React.useState(false);

    const handleMetricsDisplay = (e) => {
        setValue(true);

        setTimeout(() => {
            setValue(false);
        }, 1000);
    };

    return (
        <React.Fragment>
            <button onClick={handleMetricsDisplay}>click</button>

            <Typography
                className={
                    classes.root +
                    `alert alert-success ${showMetrics ? "show" : "hide"}`
                }
            >
                Volume
            </Typography>
        </React.Fragment>
    );
}
