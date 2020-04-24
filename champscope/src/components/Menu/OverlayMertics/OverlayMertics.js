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
            bottom: "10em",
            right: "3em",
            zIndex: 9999,
            maxWidth: "20em",
        },
    });

    const theme = createMuiTheme({
        palette: {
            textPrimary: { main: "white" },
        },
        typography: {
            h5: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "3em",
                fontWeight: "300",
                color: "white",
                textShadow: "0em 0em 0.2em #000",
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

    /*
    2020	 
 	 
    Layer	Sentence
          
    Car layer:	33% car based mobility and 318 670 gCO2/Km
    Pedestrian layer:	60% pedestrian mobility and 257 000m² of Pedestrian pathwalk.
    Bikes layer:	2% bike based mobility and 10 250 vehicles/h
    Parks layer:	75 500m2 of open land of parks and 35ºC sidewalk temperature.
    Leisure layer:	6 types of leisure offer and 7 300 m² of Relaxation areas.
          
    2040	 
          
    Car layer:	51% reduction in cars and 48% reduction in air pollution
    Pedestrian layer:	23% increase of pedestrian mobility and a increase of 29% in Pedestrian pathwalk.
    Bikes layer:	66% increase of bikes and 24% reduction of vehicles/h
    Parks layer:	49% increase of parks and 4ºC of temperature reduction in sidewalk temperature.
    Leisure layer:	20 new types of leisure offer and an increase of 585% in Relaxation areas.
*/

    const OverlayContent = () => {
        let toggle = props.thisToggleName;
        let scenario = props.scenarioSwitch;

        if (!scenario) {
            // ! 2020
            switch (toggle) {
                case "parks":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                75500m² of parks
                            </Typography>
                        </React.Fragment>
                    );
                case "culturalBuildings":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                6 leisure types, 7300m² of relaxation space
                            </Typography>
                        </React.Fragment>
                    );
                case "cars":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                33% mobility, 318,670 gCO2/Km
                            </Typography>
                        </React.Fragment>
                    );
                case "bicycles":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                2% bike based mobility, 10,250 vehicles/h
                            </Typography>
                        </React.Fragment>
                    );
                case "pedestrians":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                60% pedestrian, 257,000m² pathways
                            </Typography>
                        </React.Fragment>
                    );
                default:
                    return <React.Fragment />;
            }
        } else {
            // ! 2040
            switch (toggle) {
                case "parks":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                +49% parks area, -4ºC on sidewalks
                            </Typography>
                        </React.Fragment>
                    );
                case "culturalBuildings":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                +20 new leisure types, +585% in resting areas
                            </Typography>
                        </React.Fragment>
                    );
                case "cars":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                -51% cars, -48% air pollution
                            </Typography>
                        </React.Fragment>
                    );
                case "bicycles":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                +66% cyclists, -24% vehicles
                            </Typography>
                        </React.Fragment>
                    );
                case "pedestrians":
                    return (
                        <React.Fragment>
                            <Typography variant="h5">
                                +23% pedestrians, +29% pathways
                            </Typography>
                        </React.Fragment>
                    );
                default:
                    return <React.Fragment />;
            }
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <MuiThemeProvider theme={theme}>
                <div className={` ${bool ? "show" : "hide"}`}>
                    <div className={classes.root}>
                        <OverlayContent />
                    </div>
                </div>
            </MuiThemeProvider>
        </React.Fragment>
    );
}
