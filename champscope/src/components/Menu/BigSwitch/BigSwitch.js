import React, { useState } from "react";

import "./BigSwitch.scss";

export default function BigSwitch() {
    const [checked, updateChecked] = useState(false);

    return (
        <label className={`Toggle ${checked ? "Toggle--checked" : ""}`}>
            <input
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
