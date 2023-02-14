import React, { useState } from "react";
import "./PanelStyle.css";

function Panel(props) {
    const [showPanel, setShowPanel] = useState(false);

    const handleTogglePanel = () => {
        setShowPanel(!showPanel);
    };

    return (
        <div className="panel-container">
            <button onClick={handleTogglePanel}>Toggle Panel</button>
            <div
                className={`panel ${showPanel ? "panel-open" : "panel-closed"}`}
            >
                <p>{props.text}</p>
            </div>
        </div>
    );
}

export default Panel;
