import React, { useEffect } from "react";
import "./OverlayMertics.scss";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// ! https://codepen.io/rishatmuhametshin/pen/BWRzGB

const useStyles = makeStyles({
    root: {
        position: "fixed",
        bottom: "5em",
        right: "5em ",
    },
});

export default function OverlayMertics(props) {
    const classes = useStyles();
    const [bool, setValue] = React.useState(props);

    useEffect(() => {
        handleMetricsDisplay();
    }, [props.thisToggleName]);

    const handleMetricsDisplay = () => {
        if (props.thisToggleName) {
            setValue(true);

            setTimeout(() => {
                setValue(false);
            }, 3000);
        }
    };

    return (
        <React.Fragment>
            <div className={`${bool ? "show" : "hide"}`}>
                <Typography variant="h5" className={classes.root}>
                    {props.thisToggleName}
                </Typography>
            </div>
        </React.Fragment>
    );
}
