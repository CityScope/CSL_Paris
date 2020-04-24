import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { CSSwitch } from "./CSSwitch";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
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
import ListItem from "@material-ui/core/ListItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Drawer from "@material-ui/core/Drawer";
import OverlayMertics from "./OverlayMertics/OverlayMertics";
import Box from "@material-ui/core/Box";
import BigSwitch from "./BigSwitch/BigSwitch";

import Divider from "@material-ui/core/Divider";

// ! https://github.com/mui-org/material-ui/issues/9290

function Menu(props) {
    const drawerWidth = 300;

    const switchColors = {
        parks: "#84ff03",
        cultural: "#fe01fe",
        cars: "#fc0303",
        bicycles: "#03bafc",
        pedestrians: "#FFF7",
    };

    const theme = createMuiTheme({
        palette: {
            textPrimary: { main: "white" },
        },
        typography: {
            h5: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "3em",
                fontWeight: "300",
            },
            h6: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "1.8em",
                fontWeight: "400",
            },
            h3: {
                fontFamily: '"Roboto", "sans-serif"',
                fontSize: "1.5em",
            },
            caption: {
                fontFamily: '"Roboto", "sans-serif"',
                fontSize: "1em",
            },
        },
    });

    const useStyles = makeStyles(() => ({
        dividerColor: {
            backgroundColor: "white",
        },
        checked: {},
        radio: {
            "&$checked": {
                color: "#fff",
            },
        },

        toolBar: { alignItems: "end" },
        title: {
            flexGrow: 2,
        },
        appBar: {
            background: "rgba(0,0,0,0.7)",

            color: "white",
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        menuIconWrapper: {
            color: "rgba(255,255,255)",
            position: "fixed",
            bottom: "1em",
            right: "1em",
            zIndex: 9999,
        },

        LogoWrapper: {
            position: "fixed",
            bottom: "1em",
            left: "1em",
            zIndex: 1,
        },

        largeIcon: {
            width: 40,
            height: 40,
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        hide: {
            display: "none",
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            background: "rgba(0,0,0,0)",
            width: drawerWidth,
            height: "100%",
        },
    }));

    const handleToggle = (toggleName) => {
        listenToMenuUI({
            ...toggleStates,
            [toggleName]: !toggleStates[toggleName],
            // add only toggle name if it was turned on
            thisToggleName: !toggleStates[toggleName] ? toggleName : null,
        });
    };

    const cameraRadio = (e) => {
        listenToMenuUI({
            ...toggleStates,
            cameraScene: e.target.value,
        });
    };

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [checked] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const { toggleStates, listenToMenuUI } = props;

    return (
        <React.Fragment>
            {/*  */}
            <CssBaseline />
            {/*  */}
            <MuiThemeProvider theme={theme}>
                {/*  */}
                <OverlayMertics
                    thisToggleName={toggleStates.thisToggleName}
                    scenarioSwitch={toggleStates.scenarioSwitch}
                />
                {/*  */}
                <Tooltip title="Toggle Options" placement="top">
                    <IconButton
                        className={classes.menuIconWrapper}
                        variant="outlined"
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                    >
                        <MenuOpenIcon className={classes.largeIcon} />
                    </IconButton>
                </Tooltip>
                <div className={classes.LogoWrapper}>
                    <Logo />
                </div>
                {/*  */}

                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Collapse timeout={500} in={checked}>
                        {/*  */}

                        <AppBar position="static" className={classes.appBar}>
                            <Box p={1} />
                            <ListItem>
                                <Typography variant="h5">CityScope</Typography>
                            </ListItem>
                            <ListItem>
                                <Typography variant="h6">
                                    Champs-Élysées
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <div
                                    onChange={() => {
                                        handleToggle("scenarioSwitch");
                                    }}
                                    name="scenarioSwitch"
                                    checked={toggleStates.scenarioSwitch}
                                >
                                    <BigSwitch
                                        onChange={() => {
                                            handleToggle("scenarioSwitch");
                                        }}
                                        name="scenarioSwitch"
                                        checked={toggleStates.scenarioSwitch}
                                    />
                                </div>
                            </ListItem>
                            <Divider classes={{ root: classes.dividerColor }} />

                            {/*  */}

                            <ListItem>
                                <Typography variant="h6">
                                    select view
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        aria-label="camera"
                                        name="camera"
                                        onChange={cameraRadio}
                                    >
                                        <FormControlLabel
                                            value="animateCamera"
                                            control={
                                                <Radio
                                                    classes={{
                                                        root: classes.radio,
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption">
                                                    Animate Camera
                                                </Typography>
                                            }
                                        />

                                        <FormControlLabel
                                            value="Triomphe"
                                            control={
                                                <Radio
                                                    classes={{
                                                        root: classes.radio,
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption">
                                                    Arc de Triomphe
                                                </Typography>
                                            }
                                        />
                                        <FormControlLabel
                                            value="Champs"
                                            control={
                                                <Radio
                                                    classes={{
                                                        root: classes.radio,
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption">
                                                    Avenue des Champs-Élysées
                                                </Typography>
                                            }
                                        />
                                        <FormControlLabel
                                            value="Palais"
                                            control={
                                                <Radio
                                                    classes={{
                                                        root: classes.radio,
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption">
                                                    Grand & Petit Palais
                                                </Typography>
                                            }
                                        />
                                        <FormControlLabel
                                            value="Concorde"
                                            control={
                                                <Radio
                                                    classes={{
                                                        root: classes.radio,
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption">
                                                    Place de la Concorde
                                                </Typography>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </ListItem>

                            {/*  */}
                            <Divider classes={{ root: classes.dividerColor }} />

                            {/*  */}
                            <ListItem>
                                <Typography variant="h6">
                                    data layers
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <CSSwitch
                                    knobcolor={switchColors.parks}
                                    checked={toggleStates.parks}
                                    onChange={() => handleToggle("parks")}
                                    name="parks"
                                />
                                <Typography variant="caption">parks</Typography>
                            </ListItem>
                            <ListItem>
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
                            </ListItem>

                            <ListItem>
                                <CSSwitch
                                    knobcolor={switchColors.cars}
                                    checked={toggleStates.cars}
                                    onChange={() => handleToggle("cars")}
                                    name="cars"
                                />
                                <Typography variant="caption">cars</Typography>
                            </ListItem>
                            <ListItem>
                                <CSSwitch
                                    knobcolor={switchColors.bicycles}
                                    checked={toggleStates.bicycles}
                                    onChange={() => handleToggle("bicycles")}
                                    name="bicycles"
                                />
                                <Typography variant="caption">
                                    bicycles
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <CSSwitch
                                    knobcolor={switchColors.pedestrians}
                                    checked={toggleStates.pedestrians}
                                    onChange={() => handleToggle("pedestrians")}
                                    name="pedestrians"
                                />
                                <Typography variant="caption">
                                    pedestrians
                                </Typography>
                            </ListItem>
                            {/*  */}
                            <Divider classes={{ root: classes.dividerColor }} />
                            {/*  */}
                            <ListItem>
                                <Typography variant="h6">settings</Typography>
                            </ListItem>

                            <ListItem>
                                <Audio />
                                <Typography variant="caption">
                                    "Aux Champs Elysées" by Arthur Des Ligneris
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <CSSwitch
                                    checked={toggleStates.metricsObjSwitch}
                                    onChange={() =>
                                        handleToggle("metricsObjSwitch")
                                    }
                                    name="metricsObjSwitch"
                                />
                                <Typography variant="caption">
                                    toggle metrics
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <CSSwitch
                                    checked={toggleStates.cityModelSwitch}
                                    onChange={() =>
                                        handleToggle("cityModelSwitch")
                                    }
                                    name="cityModelSwitch"
                                />
                                <Typography variant="caption">
                                    toggle 3D model
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <CSSwitch
                                    checked={toggleStates.quality}
                                    onChange={() => handleToggle("quality")}
                                    name="quality"
                                />
                                <Typography variant="caption">
                                    render quality (for fast devices)
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <IconButton>
                                    <Info />
                                </IconButton>
                                <Typography variant="caption">
                                    information
                                </Typography>
                            </ListItem>
                            <Box p={5} />
                        </AppBar>
                    </Collapse>
                    {/*  */}
                </Drawer>

                {/*  */}
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
