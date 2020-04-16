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
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

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
            spacing: "0",
            color: "white",
            background: "rgba(0,0,0,0.7)",
            width: "100vw",
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

    const cameraRadio = (e) =>
        listenToMenuUI({
            ...toggleStates,
            cameraScene: e.target.value,
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
                {/*  */}
                <Collapse timeout={500} in={checked}>
                    {/*  */}
                    <AppBar position="static" className={classes.appBar}>
                        <Toolbar
                            classes={{
                                root: classes.toolBar,
                            }}
                        >
                            <Grid item xs={3} sm={3} md={3} lg={3}>
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
                            </Grid>
                            {/*  */}

                            <HorizontalDivider />
                            {/*  */}
                            <Grid item xs={3} sm={3} md={3} lg={3}>
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
                            </Grid>
                            {/*  */}
                            <HorizontalDivider />
                            {/*  */}
                            <Grid item xs={3} sm={3} md={3} lg={3}>
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
                                                        Triomphe
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
                                                        Champs
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
                                                        Palais
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
                                                        Concorde
                                                    </Typography>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </ListItem>
                            </Grid>
                            {/*  */}
                            <HorizontalDivider />
                            {/*  */}
                            <Grid item xs={3} sm={3} md={3} lg={3}>
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
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </Collapse>
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
