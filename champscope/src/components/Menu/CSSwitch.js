import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

export function CSSwitch(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: theme.spacing(1),
        },
        switchBase: {
            padding: 1,
            "&$checked": {
                transform: "translateX(16px)",
                color: theme.palette.common.white,
                "& + $track": {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    opacity: 1,
                    border: "none",
                },
            },
            "&$focusVisible $thumb": {
                color: "rgba(0,0,0,0.5)",
                border: "6px solid #fff",
            },
        },
        thumb: {
            width: 24,
            height: 24,
        },
        track: {
            borderRadius: 26 / 2,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            opacity: 1,
            transition: theme.transitions.create([
                "background-color",
                "border",
            ]),
        },
        checked: {},
        focusVisible: {},
    }));

    const classes = useStyles();

    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
        />
    );
}
