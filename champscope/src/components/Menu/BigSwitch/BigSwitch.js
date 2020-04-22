import React, { useState } from "react";

import "./BigSwitch.scss";

export default function BigSwitch(props) {
    const [checked, updateChecked] = useState(false);

    return (
        <label className={`Toggle ${checked ? "Toggle--checked" : ""}`}>
            <input
                name={props.name}
                id={props.name}
                type="checkbox"
                value={checked}
                onChange={() => updateChecked(!checked)}
            />

            <div className="Toggle__slider" />
            <small className="Toggle__text">2020</small>
            <small className="Toggle__text">2040</small>
        </label>
    );
}
