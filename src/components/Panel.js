import React, { useState, useRef } from "react";
import "./PanelStyle.css";
import { FaArrowRight } from "react-icons/fa";

function Panel(props) {
    const childRef = useRef(null);

    const childWidth = childRef.current ? childRef.current.offsetWidth : 0;

    return (
        <div
            className={`panel
            ${props.isActive ? "panel-open" : "panel-closed"}`}
        >
            {/* <div className={`panel panel-open"}`}> */}
            <div className="left-div" ref={childRef}>
                {props.children}
            </div>
        </div>
    );
}

export default Panel;
