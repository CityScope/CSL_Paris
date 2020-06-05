import React from "react";
import "./Video.css";
import ReactPlayer from "react-player";

// https://medium.com/@kevinsimper/full-width-youtube-embed-with-react-js-responsive-embed-509de7e7c3bf

const Video = () => {
    return (
        <div className="video-background">
            <div className="video-foreground">
                <ReactPlayer
                    url={"https://www.youtube.com/watch?v=CaLbs2E2P38"}
                    playing={true}
                    controls={false}
                    muted
                    loop
                    width={"0em"}
                    height={"0em"}
                />
            </div>
        </div>
    );
};

export default Video;
