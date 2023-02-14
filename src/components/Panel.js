import React, { useState } from "react";
import "./PanelStyle.css";

function Panel(props) {
    const [showPanel, setShowPanel] = useState(false);

    const handleTogglePanel = () => {
        setShowPanel(!showPanel);
    };

    return (
        <div className="panel-container">
            <div
                className={`panel ${showPanel ? "panel-open" : "panel-closed"}`}
            >
                <p>{props.text}</p>
                <button
                    style={{
                        // position: "absolute",
                        // marginLeft: "auto",
                        // marginRight: 0,
                        float: "right",
                    }}
                    onClick={handleTogglePanel}
                >
                    Toggle Panel
                </button>
            </div>
        </div>
    );
}

export default Panel;
