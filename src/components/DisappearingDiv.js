import "./DisappearingDivStyle.css";

export default function DisappearingDiv(props) {
    console.log("disappeared:", props.disappeared);
    return (
        <div
            className={`${props.disappeared ? "div-inactive" : "div-active"}`}
            style={{ flexGrow: 1 }}
        >
            {props.children}
        </div>
    );
}
