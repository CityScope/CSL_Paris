import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

export const CSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 23,
        padding: 2,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 2,
        "&$checked": {
            transform: "translateX(17px)",
            color: theme.palette.common.white,
            "& + $track": {
                backgroundColor: "rgba(0,0,0,0)",
                opacity: 1,
            },
        },
        "&$focusVisible $thumb": {
            color: "#222",
            border: "1px solid #FFF",
        },
    },
    thumb: {
        width: 20,
        height: 20,
    },
    track: {
        borderRadius: 50 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,

        backgroundColor: "rgba(0,0,0,0)",
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
