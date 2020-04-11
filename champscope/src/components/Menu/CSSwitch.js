import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

export const CSSwitch = withStyles((theme) => ({
    root: {
        width: 30,
        height: 12,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        "&$checked": {
            transform: "translateX(16px)",
            color: theme.palette.common.white,
            "& + $track": {
                backgroundColor: "#555",
                opacity: 1,
                border: "1px solid #000",
            },
        },
        "&$focusVisible $thumb": {
            color: "#222",
            border: "1px solid #000",
        },
    },
    thumb: {
        width: 10,
        height: 10,
    },
    track: {
        borderRadius: 30 / 2,
        backgroundColor: "#FFF7",
        opacity: 1,
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
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
            {...props}
        />
    );
});
