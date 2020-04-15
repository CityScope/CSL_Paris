import FormGroup from "@material-ui/core/FormGroup";
import { CSSwitch } from "./CSSwitch";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import HorizontalDivider from "./HorizontalDivider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { listenToMenuUI } from "../../redux/actions";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Audio from "../Audio";
import Info from "./Info";
import Logo from "./Logo";

// ! https://github.com/mui-org/material-ui/issues/9290

function Menu(props) {
    const switchColors = {
        parks: "#84ff03",
        cultural: "#03bafc",
        cars: "#fc0303",
        bicycles: "#94fc03",
        pedestrians: "#FFF8",
    };

    const theme = createMuiTheme({
        palette: {
            textPrimary: { main: "white" },
        },
        typography: {
            caption: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "1em",
            },
        },
    });

    const useStyles = makeStyles(() => ({
        paper: {
            spacing: "0",
            position: "absolute",
            color: "white",
            background: "rgba(0,0,0,0.5)",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            marginBottom: "0em",
            padding: "1em",
        },
        menuIconWrapper: {
            color: "rgba(255,255,255)",
            position: "fixed",
            bottom: "2em",
            left: "2em",
            fontSize: "2em",
        },
        largeIcon: {
            width: 40,
            height: 40,
        },
    }));

    const handleToggle = (toggleName) =>
        listenToMenuUI({
            ...toggleStates,
            [toggleName]: !toggleStates[toggleName],
        });

    const classes = useStyles();
    const [checked, setChecked] = React.useState(true);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const { toggleStates, listenToMenuUI } = props;

    return (
        <React.Fragment>
            <Logo />

            <CssBaseline />
            <MuiThemeProvider theme={theme}>
                <Tooltip title="Toggle Options" placement="top">
                    <IconButton
                        className={classes.menuIconWrapper}
                        variant="outlined"
                        onClick={handleChange}
                    >
                        <MenuOpenIcon className={classes.largeIcon} />
                    </IconButton>
                </Tooltip>
                <Collapse timeout={1} in={checked}>
                    <Paper className={classes.paper}>
                        <FormGroup row>
                            <FormControlLabel
                                value="scenario"
                                control={<Info />}
                                label={
                                    <Typography variant="caption">
                                        information
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <FormControlLabel
                                value="scenario"
                                control={
                                    <CSSwitch
                                        checked={toggleStates.scenarioSwitch}
                                        onChange={() =>
                                            handleToggle("scenarioSwitch")
                                        }
                                        name="scenarioSwitch"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        2020-2040
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <FormControlLabel
                                value="metricsObjSwitch"
                                control={
                                    <CSSwitch
                                        checked={toggleStates.metricsObjSwitch}
                                        onChange={() =>
                                            handleToggle("metricsObjSwitch")
                                        }
                                        name="metricsObjSwitch"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        stats
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <HorizontalDivider />
                            <FormControlLabel
                                value="parks"
                                control={
                                    <CSSwitch
                                        knobcolor={switchColors.parks}
                                        checked={toggleStates.parks}
                                        onChange={() => handleToggle("parks")}
                                        name="parks"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        parks
                                    </Typography>
                                }
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="cultural buildings"
                                control={
                                    <CSSwitch
                                        knobcolor={switchColors.cultural}
                                        checked={toggleStates.culturalBuildings}
                                        onChange={() =>
                                            handleToggle("culturalBuildings")
                                        }
                                        name="culturalBuildings"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        cultural
                                    </Typography>
                                }
                                labelPlacement="top"
                            />
                            <HorizontalDivider />
                            <FormControlLabel
                                value="cars"
                                control={
                                    <CSSwitch
                                        knobcolor={switchColors.cars}
                                        checked={toggleStates.cars}
                                        onChange={() => handleToggle("cars")}
                                        name="cars"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        cars
                                    </Typography>
                                }
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="bicycles"
                                control={
                                    <CSSwitch
                                        knobcolor={switchColors.bicycles}
                                        checked={toggleStates.bicycles}
                                        onChange={() =>
                                            handleToggle("bicycles")
                                        }
                                        name="bicycles"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        bicycles
                                    </Typography>
                                }
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="pedestrians"
                                control={
                                    <CSSwitch
                                        knobcolor={switchColors.pedestrians}
                                        checked={toggleStates.pedestrians}
                                        onChange={() =>
                                            handleToggle("pedestrians")
                                        }
                                        name="pedestrians"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        pedestrians
                                    </Typography>
                                }
                                labelPlacement="top"
                            />
                            <HorizontalDivider />

                            <FormControlLabel
                                value="animateCamera"
                                control={
                                    <CSSwitch
                                        checked={toggleStates.animateCamera}
                                        onChange={() =>
                                            handleToggle("animateCamera")
                                        }
                                        name="animateCamera"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        spin camera
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <FormControlLabel
                                value="quality"
                                control={
                                    <CSSwitch
                                        checked={toggleStates.quality}
                                        onChange={() => handleToggle("quality")}
                                        name="quality"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        quality
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <FormControlLabel
                                value="cityModelSwitch"
                                control={
                                    <CSSwitch
                                        checked={toggleStates.cityModelSwitch}
                                        onChange={() =>
                                            handleToggle("cityModelSwitch")
                                        }
                                        name="cityModelSwitch"
                                    />
                                }
                                label={
                                    <Typography variant="caption">
                                        3D model
                                    </Typography>
                                }
                                labelPlacement="top"
                            />

                            <HorizontalDivider />
                        </FormGroup>
                        <Grid item>
                            <Audio />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="caption">
                                "Aux champs Elysées", Arthur Des Ligneris
                            </Typography>
                        </Grid>
                    </Paper>
                </Collapse>
            </MuiThemeProvider>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    toggleStates: state.MENU_INTERACTION,
});

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
