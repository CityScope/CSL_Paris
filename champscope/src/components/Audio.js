import React, { Component } from "react";

export default class Audio extends Component {
    playAudio() {
        const audioEl = document.getElementsByClassName("audio-element")[0];
        audioEl.play();
    }

    render() {
        return (
            <div>
                <button onClick={this.playAudio}>
                    <span>Play Audio</span>
                </button>
                <audio>
                    <source
                        src="
          resources/audio/ace.mp3"
                    ></source>
                </audio>
            </div>
        );
    }
}
