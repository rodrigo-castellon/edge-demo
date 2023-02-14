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
                <div className="left-div">{props.children}</div>
                <div className="right-div">
                    <button
                        style={{
                            position: "relative",
                            top: "50%",
                            float: "right",
                        }}
                        onClick={handleTogglePanel}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Panel;
