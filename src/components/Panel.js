import React, { useState } from "react";
import "./PanelStyle.css";
import { FaArrowRight } from "react-icons/fa";

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
                {props.children}
                {/* <p>{props.text}</p> */}
                <button
                    style={{
                        // position: "absolute",
                        // marginLeft: "auto",
                        // marginRight: 0,
                        float: "right",
                    }}
                    onClick={handleTogglePanel}
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}

export default Panel;
