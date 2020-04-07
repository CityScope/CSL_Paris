import React from "react";
import "./Video.css";

// https://medium.com/@kevinsimper/full-width-youtube-embed-with-react-js-responsive-embed-509de7e7c3bf

const Video = () => {
    const videoSource =
        "https://www.youtube.com/embed/iQMxxWdtyVc?start=10&end=60&loop=1&autoplay=1&rel=0&mute=1&controls=0&showinfo=0&playlist=iQMxxWdtyVc";
    return (
        <div className="video-background">
            <div className="video-foreground">
                <iframe
                    autoPlay="autoplay"
                    loop="loop"
                    muted
                    style={{ width: "100%", height: "100%", opacity: 0.6 }}
                    src={videoSource}
                    type="video/mp4"
                    title="vid"
                />
            </div>
        </div>
    );
};

export default Video;
