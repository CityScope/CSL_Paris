import React, { Component } from "react";
import ReactPlayer from "react-player";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import Button from "@material-ui/core/Button";

const style = {
    audioIconWrapper: {
        color: "rgba(255,255,255)",
        width: 30,
        height: 30,
    },
};

export default class Audio extends Component {
    state = {
        playing: false,
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
                        <PauseCircleOutlineIcon
                            style={style.audioIconWrapper}
                        />
                    </Button>
                );
            } else {
                return (
                    <Button onClick={this.handlePlay}>
                        <PlayCircleOutlineIcon style={style.audioIconWrapper} />
                    </Button>
                );
            }
        };

        return (
            <React.Fragment>
                {iconSelector()}

                <ReactPlayer
                    url={"resources/audio/ace.mp3"}
                    playing={this.state.playing}
                    controls={false}
                    loop
                    width={"0em"}
                    height={"0em"}
                />
            </React.Fragment>
        );
    }
}
