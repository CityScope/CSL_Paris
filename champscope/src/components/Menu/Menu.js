import FormGroup from "@material-ui/core/FormGroup";
import { CSSwitch } from "./CSSwitch";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import HorizontalDivider from "./HorizontalDivider";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { listenToMenuUI } from "../../redux/actions";
import { connect } from "react-redux";

// ! https://github.com/mui-org/material-ui/issues/9290
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Menu(props) {
    const useStyles = makeStyles(() => ({
        formGroup: {
            spacing: "0",
            color: "white",
            background: "rgba(0,0,0,0.5)",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            bottom: "0",
            left: "0",
            maxHeight: "40vh",
            marginBottom: "0em",
            padding: "1em",
        },
        menuIconWrapper: {
            color: "rgba(255,255,255)",
            position: "fixed",
            top: "2em",
            left: "2em",
            fontSize: "2em",
        },
        largeIcon: {
            width: 40,
            height: 40,
        },
        dialog: {
            backgroundColor: "rgba(255,255,255,0)",
        },
    }));

    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { toggleStates, listenToMenuUI } = props;

    const handleToggle = (toggleName) =>
        listenToMenuUI({
            ...toggleStates,
            [toggleName]: !toggleStates[toggleName],
        });
    return (
        <div>
            <IconButton
                className={classes.menuIconWrapper}
                variant="outlined"
                onClick={handleClickOpen}
            >
                <MenuOpenIcon className={classes.largeIcon} />
            </IconButton>

            <Dialog
                BackdropProps={{
                    invisible: true,
                }}
                className={classes.dialog}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogContent className={classes.formGroup}>
                    <FormGroup row>
                        <FormControlLabel
                            value="scenario"
                            control={
                                <CSSwitch
                                    pixels={100}
                                    checked={toggleStates.scenarioSwitch}
                                    onChange={() =>
                                        handleToggle("scenarioSwitch")
                                    }
                                    name="scenarioSwitch"
                                />
                            }
                            label="2020 - 2040"
                            labelPlacement="top"
                        />
                        <HorizontalDivider />
                        <FormControlLabel
                            value="parks"
                            control={
                                <CSSwitch
                                    checked={toggleStates.parks}
                                    onChange={() => handleToggle("parks")}
                                    name="parks"
                                />
                            }
                            label="parks"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            value="cultural buildings"
                            control={
                                <CSSwitch
                                    checked={toggleStates.culturalBuildings}
                                    onChange={() =>
                                        handleToggle("culturalBuildings")
                                    }
                                    name="culturalBuildings"
                                />
                            }
                            label="cultural"
                            labelPlacement="top"
                        />
                        <HorizontalDivider />
                        <FormControlLabel
                            value="cars"
                            control={
                                <CSSwitch
                                    checked={toggleStates.cars}
                                    onChange={() => handleToggle("cars")}
                                    name="cars"
                                />
                            }
                            label="cars"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            value="bicycles"
                            control={
                                <CSSwitch
                                    checked={toggleStates.bicycles}
                                    onChange={() => handleToggle("bicycles")}
                                    name="bicycles"
                                />
                            }
                            label="bicycles"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            value="pedestrians"
                            control={
                                <CSSwitch
                                    checked={toggleStates.pedestrians}
                                    onChange={() => handleToggle("pedestrians")}
                                    name="pedestrians"
                                />
                            }
                            label="pedestrians"
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
                            label="animate camera"
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
                            label="quality"
                            labelPlacement="top"
                        />
                        <HorizontalDivider />
                    </FormGroup>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const mapStateToProps = (state) => ({
    toggleStates: state.MENU_INTERACTION,
});

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
