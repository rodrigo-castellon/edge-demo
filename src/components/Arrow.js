import React, { useState, useRef } from "react";
import "./ArrowStyle.css";

export default function Arrow(props) {
    console.log("isactive?", props.isActive);
    return (
        <div
            className={`arrow-button`}
            onClick={() => {
                props.panelHandler();
            }}
        >
            <div
                className={`arrow-div ${
                    props.isActive ? "active" : "inactive"
                }`}
            />
        </div>
    );
}
