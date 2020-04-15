import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { CSSwitch } from "./CSSwitch";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import HorizontalDivider from "./HorizontalDivider";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { listenToMenuUI } from "../../redux/actions";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import Audio from "../Audio";
import Info from "./Info";
import Logo from "./Logo";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

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
            h6: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "2em",
                fontWeight: "400",
            },
            caption: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "1em",
            },
        },
    });

    const useStyles = makeStyles(() => ({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        menuBar: {
            spacing: "0",
            color: "white",
            background: "rgba(0,0,0,0.7)",
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

        label: {
            width: "50%",
            paddingBottom: "5px",
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
                <Collapse timeout={500} in={checked}>
                    {/*  */}

                    <AppBar position="static" className={classes.menuBar}>
                        <Toolbar>
                            <Grid item xs={12} sm={6} md={4} lg={3} container>
                                <ListItem>
                                    <ListItemIcon>
                                        <CSSwitch
                                            checked={
                                                toggleStates.scenarioSwitch
                                            }
                                            onChange={() =>
                                                handleToggle("scenarioSwitch")
                                            }
                                            name="scenarioSwitch"
                                        />
                                    </ListItemIcon>

                                    <ListItemText>
                                        <Typography variant="h6">
                                            2020-2040
                                        </Typography>
                                    </ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Info />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography variant="caption">
                                            information
                                        </Typography>
                                    </ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <CSSwitch
                                            checked={
                                                toggleStates.metricsObjSwitch
                                            }
                                            onChange={() =>
                                                handleToggle("metricsObjSwitch")
                                            }
                                            name="metricsObjSwitch"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography variant="caption">
                                            design metrics
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            <HorizontalDivider />
                            <Grid item xs={12} sm={6} md={4} lg={3} container>
                                <CSSwitch
                                    knobcolor={switchColors.parks}
                                    checked={toggleStates.parks}
                                    onChange={() => handleToggle("parks")}
                                    name="parks"
                                />
                                <Typography variant="caption">parks</Typography>
                                <CSSwitch
                                    knobcolor={switchColors.cultural}
                                    checked={toggleStates.culturalBuildings}
                                    onChange={() =>
                                        handleToggle("culturalBuildings")
                                    }
                                    name="culturalBuildings"
                                />
                                <Typography variant="caption">
                                    cultural
                                </Typography>
                            </Grid>
                            <HorizontalDivider />
                            <Grid item xs={12} sm={6} md={4} lg={3} container>
                                <CSSwitch
                                    knobcolor={switchColors.cars}
                                    checked={toggleStates.cars}
                                    onChange={() => handleToggle("cars")}
                                    name="cars"
                                />
                                <Typography variant="caption">cars</Typography>
                                <CSSwitch
                                    knobcolor={switchColors.bicycles}
                                    checked={toggleStates.bicycles}
                                    onChange={() => handleToggle("bicycles")}
                                    name="bicycles"
                                />
                                <Typography variant="caption">
                                    bicycles
                                </Typography>
                                <CSSwitch
                                    knobcolor={switchColors.pedestrians}
                                    checked={toggleStates.pedestrians}
                                    onChange={() => handleToggle("pedestrians")}
                                    name="pedestrians"
                                />
                                <Typography variant="caption">
                                    pedestrians
                                </Typography>
                            </Grid>
                            <HorizontalDivider />
                            <Grid item xs={12} sm={6} md={4} lg={3} container>
                                <React.Fragment>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={"cam1"}
                                        onChange={(e) => console.log(e)}
                                    >
                                        <MenuItem value={1}>Arch</MenuItem>
                                    </Select>
                                </React.Fragment>
                                <Typography variant="caption">
                                    camera view
                                </Typography>
                                <CSSwitch
                                    checked={toggleStates.animateCamera}
                                    onChange={() =>
                                        handleToggle("animateCamera")
                                    }
                                    name="animateCamera"
                                />
                                <Typography variant="caption">
                                    spin camera
                                </Typography>
                                <CSSwitch
                                    checked={toggleStates.quality}
                                    onChange={() => handleToggle("quality")}
                                    name="quality"
                                />
                                <Typography variant="caption">
                                    quality
                                </Typography>
                                <CSSwitch
                                    checked={toggleStates.cityModelSwitch}
                                    onChange={() =>
                                        handleToggle("cityModelSwitch")
                                    }
                                    name="cityModelSwitch"
                                />
                                <Typography variant="caption">
                                    3D model
                                </Typography>
                            </Grid>
                            <HorizontalDivider />
                            <Grid item xs={12} sm={6} md={4} lg={3} container>
                                <Audio />
                                <Typography variant="caption">
                                    "Aux champs Elysées", Arthur Des Ligneris
                                </Typography>
                            </Grid>
                        </Toolbar>
                    </AppBar>
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
