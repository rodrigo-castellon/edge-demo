import React, { useState, useRef } from "react";
import "./ArrowStyle.css";

export default function Arrow(props) {
    return (
        <div className={`arrow-box ${props.isActive ? "active" : "inactive"}`}>
            <a
                href="#"
                onClick={() => {
                    props.panelHandler();
                }}
            ></a>
        </div>
    );
}
