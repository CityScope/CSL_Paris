import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function LoadingSprite() {
    return (
        <div>
            <CircularProgress
                style={{
                    borderColor: "#fff",
                    color: "white",
                    fontWeight: "bolder",
                }}
            />
        </div>
    );
}
