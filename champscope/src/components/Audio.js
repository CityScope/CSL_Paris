import React, { Component } from "react";
import ReactPlayer from "react-player";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";

const style = {
    menuIconWrapper: {
        color: "rgba(255,255,255)",
        position: "fixed",
        top: "2em",
        right: "2em",
        fontSize: "2em",
        width: 40,
        height: 40,
    },
};

export default class Audio extends Component {
    state = {
        playing: true,
    };

    handlePause = () => {
        this.setState({ playing: false });
    };

    handlePlay = () => {
        this.setState({ playing: true });
    };

    render() {
        const iconSelector = () => {
            if (this.state.playing) {
                return (
                    <Button onClick={this.handlePause}>
                        <PauseCircleOutlineIcon style={style.menuIconWrapper} />
                    </Button>
                );
            } else {
                return (
                    <Button onClick={this.handlePlay}>
                        <PlayCircleOutlineIcon style={style.menuIconWrapper} />
                    </Button>
                );
            }
        };

        return (
            <React.Fragment>
                {iconSelector()}

                <ReactPlayer
                    preload={"true"}
                    url={"resources/audio/ace.mp3"}
                    playing={this.state.playing}
                    controls={false}
                    loop
                    width={"15em"}
                    height={"2em"}
                />
            </React.Fragment>
        );
    }
}
