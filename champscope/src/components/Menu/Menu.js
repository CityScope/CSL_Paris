import FormGroup from "@material-ui/core/FormGroup";
import { CSSwitch } from "./CSSwitch";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import HorizontalDivider from "./HorizontalDivider";
import ReactPlayer from "react-player";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

// ! https://github.com/mui-org/material-ui/issues/9290
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Menu() {
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
    }));

    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const [state, setState] = React.useState({
        scenarioSwitch: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(state);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                                    checked={state.scenarioSwitch}
                                    onChange={handleChange}
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
                                    checked={state.checked}
                                    onChange={handleChange}
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
                                    checked={state.checked}
                                    onChange={handleChange}
                                    name="cultural buildings"
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
                                    checked={state.checked}
                                    onChange={handleChange}
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
                                    checked={state.checked}
                                    onChange={handleChange}
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
                                    checked={state.checked}
                                    onChange={handleChange}
                                    name="pedestrians"
                                />
                            }
                            label="pedestrians"
                            labelPlacement="top"
                        />
                        <HorizontalDivider />
                        <FormControlLabel
                            value="city model"
                            control={
                                <CSSwitch
                                    checked={state.checked}
                                    onChange={handleChange}
                                    name="city model"
                                />
                            }
                            label="city model"
                            labelPlacement="top"
                        />
                        <HorizontalDivider />
                        <div style={{ paddingLeft: "2em" }}>
                            <ReactPlayer
                                url={"resources/audio/ace.mp3"}
                                playing={false}
                                controls={true}
                                loop
                                width={"15em"}
                                height={"2em"}
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: "nodownload",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </FormGroup>
                </DialogContent>
            </Dialog>
        </div>
    );
}
