import React, { useEffect } from "react";
import "./OverlayMertics.scss";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// ! https://codepen.io/rishatmuhametshin/pen/BWRzGB

export default function OverlayMertics(props) {
    const useStyles = makeStyles({
        root: {
            position: "fixed",
            bottom: "25em",
            right: "3em",
            zIndex: 9999,
        },
    });

    const theme = createMuiTheme({
        palette: {
            textPrimary: { main: "white" },
        },
        typography: {
            h3: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "5em",
                fontWeight: "300",
                color: "white",
                textShadow: "0em 0em 0.2em #000 ",
            },
        },
    });

    const classes = useStyles();
    const [bool, setValue] = React.useState(props);

    // render on new props
    useEffect(() => {
        // only show when toggled on
        if (props.thisToggleName) {
            setValue(true);
            setTimeout(() => {
                setValue(false);
            }, 3000);
        }
    }, [props.thisToggleName]);

    const OverlayContent = () => {
        switch (props.thisToggleName) {
            case "parks":
                return <Typography variant="h3">Waiting for Luis</Typography>;
            case "culturalBuildings":
                return <Typography variant="h3">Waiting for Luis</Typography>;
            case "cars":
                return <Typography variant="h3">Waiting for Luis</Typography>;
            case "bicycles":
                return <Typography variant="h3">Waiting for Luis</Typography>;
            case "pedestrians":
                return <Typography variant="h3">Waiting for Luis</Typography>;
            default:
                return <React.Fragment />;
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <MuiThemeProvider theme={theme}>
                <div className={classes.root + ` ${bool ? "show" : "hide"}`}>
                    <OverlayContent />
                </div>
            </MuiThemeProvider>
        </React.Fragment>
    );
}
