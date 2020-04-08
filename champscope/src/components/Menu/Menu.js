import FormGroup from "@material-ui/core/FormGroup";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { CSSwitch } from "./CSSwitch";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import Switch from "@material-ui/core/Switch";
import HorizontalDivider from "./HorizontalDivider";

export default function Menu() {
    const [state, setState] = React.useState({
        scenarioSwitch: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(state);
    };

    return (
        <FormGroup
            row
            spacing={0}
            style={{
                color: "white",
                background: "rgba(0,0,0,0.5)",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                position: "fixed",
                bottom: "0",
                left: "0",
                maxHeight: "20vh",
                marginBottom: "1em",
            }}
        >
            <FormControlLabel
                value="scenario"
                control={
                    <CSSwitch
                        checked={state.scenarioSwitch}
                        onChange={handleChange}
                        name="scenarioSwitch"
                    />
                }
                label="Champs 2020/2040"
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
        </FormGroup>
    );
}
