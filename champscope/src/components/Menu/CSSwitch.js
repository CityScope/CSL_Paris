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
                backgroundColor: "#888",
                opacity: 1,
            },
        },
        "&$focusVisible $thumb": {
            color: "#888",
            border: "1px solid #FFF",
        },
    },
    thumb: {
        width: 10,
        height: 10,
    },
    track: {
        borderRadius: 30 / 2,
        backgroundColor: "#FFF3",
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
