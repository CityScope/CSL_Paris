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
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import OverlayMertics from "./OverlayMertics/OverlayMertics";

// ! https://github.com/mui-org/material-ui/issues/9290

function Menu(props) {
    const drawerWidth = 240;

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
                fontSize: "2.5em",
                fontWeight: "300",
            },
            h6: {
                fontFamily: '"Cormorant Garamond", "sans-serif"',
                fontSize: "1.6em",
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
        radio: {
            "&$checked": {
                color: "#fff",
            },
        },
        checked: {},
        toolBar: { alignItems: "end" },
        menuButton: {},
        title: {
            flexGrow: 2,
        },
        appBar: {
            color: "white",
            background: "rgba(0,0,0,0.7)",
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
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

        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: "none",
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
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
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

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
            <Logo />
            {/*  */}
            <CssBaseline />
            {/*  */}
            <MuiThemeProvider theme={theme}>
                {/*  */}
                <OverlayMertics thisToggleName={toggleStates.thisToggleName} />
                {/*  */}
                <Tooltip title="Toggle Options" placement="top">
                    <IconButton
                        className={classes.menuIconWrapper}
                        variant="outlined"
                        onClick={handleDrawerOpen}
                    >
                        <MenuOpenIcon className={classes.largeIcon} />
                    </IconButton>
                </Tooltip>
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
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "ltr" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                        <Collapse timeout={500} in={checked}>
                            {/*  */}

                            <AppBar
                                position="static"
                                className={classes.appBar}
                            >
                                <ListItem>
                                    <Typography variant="h6">
                                        present & future
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <CSSwitch
                                        checked={toggleStates.scenarioSwitch}
                                        onChange={() =>
                                            handleToggle("scenarioSwitch")
                                        }
                                        name="scenarioSwitch"
                                    />
                                    <Typography variant="caption">
                                        2020-2040
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

                                <ListItem>
                                    <Typography variant="h6">
                                        display
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
                                        design metrics
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
                                    <Typography variant="h6">
                                        spatial design
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <CSSwitch
                                        knobcolor={switchColors.parks}
                                        checked={toggleStates.parks}
                                        onChange={() => handleToggle("parks")}
                                        name="parks"
                                    />
                                    <Typography variant="caption">
                                        parks
                                    </Typography>
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
                                    <Typography variant="h6">
                                        mobility
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <CSSwitch
                                        knobcolor={switchColors.cars}
                                        checked={toggleStates.cars}
                                        onChange={() => handleToggle("cars")}
                                        name="cars"
                                    />
                                    <Typography variant="caption">
                                        cars
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <CSSwitch
                                        knobcolor={switchColors.bicycles}
                                        checked={toggleStates.bicycles}
                                        onChange={() =>
                                            handleToggle("bicycles")
                                        }
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
                                        onChange={() =>
                                            handleToggle("pedestrians")
                                        }
                                        name="pedestrians"
                                    />
                                    <Typography variant="caption">
                                        pedestrians
                                    </Typography>
                                </ListItem>

                                <ListItem>
                                    <Typography variant="h6">
                                        select scene
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
                                                value="Triomphe"
                                                control={
                                                    <Radio
                                                        classes={{
                                                            root: classes.radio,
                                                            checked:
                                                                classes.checked,
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
                                                            checked:
                                                                classes.checked,
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="caption">
                                                        Avenue des
                                                        Champs-Élysées
                                                    </Typography>
                                                }
                                            />
                                            <FormControlLabel
                                                value="Palais"
                                                control={
                                                    <Radio
                                                        classes={{
                                                            root: classes.radio,
                                                            checked:
                                                                classes.checked,
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
                                                            checked:
                                                                classes.checked,
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

                                <ListItem>
                                    <Typography variant="h6">
                                        settings
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Audio />
                                    <Typography variant="caption">
                                        "Aux Champs Elysées" by Arthur Des
                                        Ligneris
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
                            </AppBar>
                        </Collapse>
                        {/*  */}
                    </div>
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
