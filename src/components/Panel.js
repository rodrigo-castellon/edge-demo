import React, { useState, useRef } from "react";
import "./PanelStyle.css";
import { FaArrowRight } from "react-icons/fa";

function Panel(props) {
    const [showPanel, setShowPanel] = useState(false);
    const childRef = useRef(null);

    const handleTogglePanel = () => {
        setShowPanel(!showPanel);
    };

    const childWidth = childRef.current ? childRef.current.offsetWidth : 0;

    return (
        <div
            className={`panel ${showPanel ? "panel-open" : "panel-closed"}`}
            style={{
                transform: `translateX(${showPanel ? 0 : -childWidth}px)`,
            }}
        >
            <div className="left-div" ref={childRef}>
                {props.children}
            </div>
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
        // </div>
    );
}

export default Panel;
