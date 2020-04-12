import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import SvgIcon from "@material-ui/core/SvgIcon";

export default function Logo() {
    const useStyles = makeStyles(() => ({
        CSlogo: {
            position: "fixed",
            bottom: "1em",
            right: "1em",
            color: "white",
            fontSize: "4em",
        },
    }));

    const classes = useStyles();

    return (
        <SvgIcon className={classes.CSlogo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                <path
                    fill="#FFF"
                    d="M 60.2 38.4 c -0.5 0 -1 -0.1 -1.5 -0.3 c -0.4 -0.2 -0.8 -0.4 -1.1 -0.7 c -0.3 -0.3 -0.6 -0.7 -0.7 -1.1 c -0.2 -0.4 -0.3 -0.9 -0.3 -1.4 c 0 -0.5 0.1 -1 0.2 -1.4 c 0.2 -0.4 0.4 -0.8 0.7 -1.1 c 0.3 -0.3 0.7 -0.6 1.1 -0.7 c 0.4 -0.2 0.9 -0.3 1.4 -0.3 c 0.5 0 0.9 0.1 1.2 0.2 c 0.4 0.1 0.7 0.3 1 0.5 c 0.3 0.2 0.5 0.5 0.7 0.8 c 0.2 0.3 0.3 0.7 0.3 1 h -2.1 c -0.1 -0.3 -0.2 -0.5 -0.4 -0.7 c -0.2 -0.2 -0.4 -0.3 -0.7 -0.3 c -0.5 0 -0.8 0.2 -1 0.5 c -0.2 0.4 -0.3 0.8 -0.3 1.4 c 0 0.6 0.1 1.1 0.3 1.4 c 0.2 0.3 0.6 0.5 1 0.5 c 0.7 0 1.1 -0.4 1.2 -1.2 h 2 c 0 0.4 -0.1 0.7 -0.3 1.1 c -0.2 0.3 -0.4 0.6 -0.6 0.9 c -0.3 0.2 -0.6 0.4 -1 0.6 C 61.1 38.4 60.6 38.4 60.2 38.4 Z M 64 28.8 h 2.1 v 1.7 H 64 V 28.8 Z M 64 31.5 h 2.1 v 6.7 H 64 V 31.5 Z M 69.9 38.3 c -0.3 0 -0.6 0 -0.9 -0.1 c -0.3 -0.1 -0.5 -0.2 -0.7 -0.3 c -0.2 -0.1 -0.3 -0.3 -0.4 -0.6 c -0.1 -0.2 -0.2 -0.5 -0.2 -0.9 v -3.6 h -0.9 v -1.3 h 0.9 v -2.1 h 2.1 v 2.1 H 71 v 1.3 h -1.2 V 36 c 0 0.3 0.1 0.4 0.2 0.5 c 0.1 0.1 0.3 0.1 0.5 0.1 c 0.1 0 0.2 0 0.3 0 c 0.1 0 0.2 0 0.2 0 v 1.6 c -0.1 0 -0.2 0.1 -0.4 0.1 C 70.4 38.3 70.2 38.3 69.9 38.3 Z M 72.2 38.8 H 73 c 0.3 0 0.5 -0.1 0.7 -0.2 c 0.1 -0.1 0.2 -0.3 0.2 -0.5 c 0 -0.1 0 -0.3 -0.1 -0.5 c -0.1 -0.2 -0.2 -0.5 -0.3 -0.9 l -2 -5.2 h 2.3 l 0.9 2.9 c 0.1 0.2 0.1 0.3 0.2 0.5 c 0 0.2 0.1 0.3 0.1 0.5 c 0 0.2 0.1 0.3 0.1 0.5 h 0 c 0 -0.2 0.1 -0.3 0.1 -0.5 c 0 -0.1 0.1 -0.3 0.1 -0.5 c 0 -0.2 0.1 -0.4 0.2 -0.5 l 0.9 -2.9 h 2.1 l -2.3 6.8 c -0.1 0.4 -0.3 0.7 -0.4 1 c -0.2 0.3 -0.3 0.5 -0.5 0.7 c -0.2 0.2 -0.4 0.3 -0.7 0.4 c -0.3 0.1 -0.6 0.1 -0.9 0.1 h -1.4 V 38.8 Z M 59.8 50 c -1 0 -1.8 -0.2 -2.3 -0.6 c -0.6 -0.4 -0.9 -1 -0.9 -1.8 h 2 c 0 0.3 0.2 0.6 0.4 0.7 c 0.2 0.2 0.5 0.2 0.9 0.2 c 0.3 0 0.6 -0.1 0.8 -0.2 c 0.2 -0.1 0.3 -0.3 0.3 -0.5 c 0 -0.1 0 -0.3 -0.1 -0.4 c -0.1 -0.1 -0.2 -0.2 -0.4 -0.2 c -0.2 -0.1 -0.3 -0.1 -0.5 -0.1 c -0.2 0 -0.4 -0.1 -0.6 -0.1 c -0.3 -0.1 -0.6 -0.1 -0.9 -0.2 c -0.3 -0.1 -0.5 -0.2 -0.8 -0.3 c -0.2 -0.1 -0.4 -0.3 -0.6 -0.6 c -0.1 -0.2 -0.2 -0.6 -0.2 -1 c 0 -0.3 0.1 -0.7 0.2 -0.9 c 0.2 -0.3 0.4 -0.5 0.6 -0.7 c 0.3 -0.2 0.6 -0.3 0.9 -0.4 c 0.4 -0.1 0.7 -0.1 1.1 -0.1 c 1 0 1.7 0.2 2.2 0.6 c 0.5 0.4 0.8 0.9 0.8 1.6 h -2 c 0 -0.3 -0.2 -0.5 -0.3 -0.6 c -0.2 -0.1 -0.4 -0.2 -0.7 -0.2 c -0.3 0 -0.5 0 -0.7 0.2 c -0.2 0.1 -0.3 0.3 -0.3 0.5 c 0 0.1 0 0.2 0.1 0.3 c 0.1 0.1 0.2 0.1 0.4 0.2 c 0.1 0 0.3 0.1 0.5 0.1 c 0.2 0 0.4 0.1 0.6 0.1 c 0.3 0.1 0.6 0.1 0.9 0.2 c 0.3 0.1 0.6 0.2 0.8 0.3 c 0.2 0.2 0.5 0.4 0.6 0.6 c 0.2 0.3 0.2 0.6 0.2 1 c 0 0.4 -0.1 0.7 -0.2 1 c -0.2 0.3 -0.4 0.5 -0.6 0.7 c -0.3 0.2 -0.6 0.3 -1 0.4 C 60.6 50 60.2 50 59.8 50 Z M 66.8 50 c -0.5 0 -1 -0.1 -1.5 -0.3 c -0.4 -0.2 -0.8 -0.4 -1.1 -0.7 c -0.3 -0.3 -0.6 -0.7 -0.7 -1.1 c -0.2 -0.4 -0.3 -0.9 -0.3 -1.4 c 0 -0.5 0.1 -1 0.2 -1.4 c 0.2 -0.4 0.4 -0.8 0.7 -1.1 c 0.3 -0.3 0.7 -0.6 1.1 -0.7 c 0.4 -0.2 0.9 -0.3 1.4 -0.3 c 0.5 0 0.9 0.1 1.2 0.2 c 0.4 0.1 0.7 0.3 1 0.5 c 0.3 0.2 0.5 0.5 0.7 0.8 c 0.2 0.3 0.3 0.7 0.3 1 h -2.1 c -0.1 -0.3 -0.2 -0.5 -0.4 -0.7 c -0.2 -0.2 -0.4 -0.3 -0.7 -0.3 c -0.5 0 -0.8 0.2 -1 0.5 c -0.2 0.4 -0.3 0.8 -0.3 1.4 c 0 0.6 0.1 1.1 0.3 1.4 c 0.2 0.3 0.6 0.5 1 0.5 c 0.7 0 1.1 -0.4 1.2 -1.2 h 2 c 0 0.4 -0.1 0.7 -0.3 1.1 c -0.2 0.3 -0.4 0.6 -0.6 0.9 c -0.3 0.2 -0.6 0.4 -1 0.6 C 67.8 49.9 67.3 50 66.8 50 Z M 70.7 40.4 h 2.1 v 1.7 h -2.1 V 40.4 Z M 70.7 43.1 h 2.1 v 6.7 h -2.1 V 43.1 Z M 77.2 50 c -0.6 0 -1 -0.1 -1.5 -0.3 c -0.4 -0.2 -0.8 -0.4 -1.1 -0.7 c -0.3 -0.3 -0.5 -0.7 -0.7 -1.1 c -0.2 -0.4 -0.2 -0.9 -0.2 -1.4 c 0 -0.5 0.1 -1 0.2 -1.4 s 0.4 -0.8 0.7 -1.1 c 0.3 -0.3 0.7 -0.6 1.1 -0.7 c 0.4 -0.2 0.9 -0.3 1.4 -0.3 c 0.5 0 0.9 0.1 1.3 0.2 c 0.4 0.1 0.7 0.4 1 0.6 c 0.4 0.4 0.7 0.8 0.9 1.4 c 0.2 0.6 0.3 1.2 0.3 1.9 h -4.8 c 0.1 0.5 0.2 0.8 0.5 1.1 c 0.2 0.3 0.6 0.4 1 0.4 c 0.3 0 0.5 -0.1 0.7 -0.2 c 0.2 -0.1 0.3 -0.3 0.4 -0.5 h 2.1 c -0.1 0.3 -0.2 0.6 -0.4 0.9 c -0.2 0.3 -0.4 0.5 -0.7 0.7 c -0.3 0.2 -0.6 0.4 -0.9 0.5 C 78 49.9 77.6 50 77.2 50 Z M 78.3 45.7 c 0 -0.4 -0.2 -0.7 -0.4 -1 c -0.2 -0.2 -0.5 -0.4 -0.9 -0.4 c -0.4 0 -0.7 0.1 -0.9 0.4 c -0.2 0.2 -0.4 0.6 -0.4 1 H 78.3 Z M 81.2 43.1 h 2.1 V 44 h 0 c 0.3 -0.4 0.5 -0.6 0.9 -0.8 c 0.3 -0.2 0.7 -0.3 1.2 -0.3 c 0.4 0 0.7 0.1 1 0.2 c 0.3 0.1 0.5 0.3 0.7 0.5 c 0.2 0.2 0.4 0.5 0.5 0.8 c 0.1 0.3 0.2 0.7 0.2 1 v 4.4 h -2.1 v -3.9 c 0 -0.4 -0.1 -0.6 -0.3 -0.9 c -0.2 -0.2 -0.4 -0.3 -0.8 -0.3 c -0.4 0 -0.6 0.1 -0.9 0.4 c -0.2 0.3 -0.3 0.6 -0.3 1 v 3.7 h -2.1 V 43.1 Z M 92 50 c -0.5 0 -1 -0.1 -1.5 -0.3 c -0.4 -0.2 -0.8 -0.4 -1.1 -0.7 c -0.3 -0.3 -0.6 -0.7 -0.7 -1.1 c -0.2 -0.4 -0.3 -0.9 -0.3 -1.4 c 0 -0.5 0.1 -1 0.2 -1.4 c 0.2 -0.4 0.4 -0.8 0.7 -1.1 c 0.3 -0.3 0.7 -0.6 1.1 -0.7 c 0.4 -0.2 0.9 -0.3 1.4 -0.3 c 0.5 0 0.9 0.1 1.2 0.2 c 0.4 0.1 0.7 0.3 1 0.5 c 0.3 0.2 0.5 0.5 0.7 0.8 c 0.2 0.3 0.3 0.7 0.3 1 h -2.1 c -0.1 -0.3 -0.2 -0.5 -0.4 -0.7 c -0.2 -0.2 -0.4 -0.3 -0.7 -0.3 c -0.5 0 -0.8 0.2 -1 0.5 c -0.2 0.4 -0.3 0.8 -0.3 1.4 c 0 0.6 0.1 1.1 0.3 1.4 c 0.2 0.3 0.6 0.5 1 0.5 c 0.7 0 1.1 -0.4 1.2 -1.2 h 2 c 0 0.4 -0.1 0.7 -0.3 1.1 c -0.2 0.3 -0.4 0.6 -0.6 0.9 c -0.3 0.2 -0.6 0.4 -1 0.6 C 92.9 49.9 92.4 50 92 50 Z M 99.1 50 c -0.6 0 -1 -0.1 -1.5 -0.3 c -0.4 -0.2 -0.8 -0.4 -1.1 -0.7 c -0.3 -0.3 -0.5 -0.7 -0.7 -1.1 c -0.2 -0.4 -0.2 -0.9 -0.2 -1.4 c 0 -0.5 0.1 -1 0.2 -1.4 s 0.4 -0.8 0.7 -1.1 c 0.3 -0.3 0.7 -0.6 1.1 -0.7 c 0.4 -0.2 0.9 -0.3 1.4 -0.3 c 0.5 0 0.9 0.1 1.3 0.2 c 0.4 0.1 0.7 0.4 1 0.6 c 0.4 0.4 0.7 0.8 0.9 1.4 c 0.2 0.6 0.3 1.2 0.3 1.9 h -4.8 c 0.1 0.5 0.2 0.8 0.5 1.1 c 0.2 0.3 0.6 0.4 1 0.4 c 0.3 0 0.5 -0.1 0.7 -0.2 c 0.2 -0.1 0.3 -0.3 0.4 -0.5 h 2.1 c -0.1 0.3 -0.2 0.6 -0.4 0.9 c -0.2 0.3 -0.4 0.5 -0.7 0.7 c -0.3 0.2 -0.6 0.4 -0.9 0.5 C 99.9 49.9 99.6 50 99.1 50 Z M 100.3 45.7 c 0 -0.4 -0.2 -0.7 -0.4 -1 c -0.2 -0.2 -0.5 -0.4 -0.9 -0.4 c -0.4 0 -0.7 0.1 -0.9 0.4 c -0.2 0.2 -0.4 0.6 -0.4 1 H 100.3 Z M 0 49.9 L 0 0 M 0 0 v 49.8 h 21.3 v -7.1 H 7.1 V 7.1 h 42.7 V 0 L 0 0 Z M 14.2 14.2 v 21.3 h 28.5 v 7.1 H 28.5 v 7.1 h 21.3 V 28.5 H 21.3 v -7.1 h 28.5 v -7.1 H 14.2 Z"
                />
            </svg>
        </SvgIcon>
    );
}
