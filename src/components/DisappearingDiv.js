export default function DisappearingDiv(props) {
    console.log("disappeared:", props.disappeared);
    if (props.disappeared) {
        return <div></div>;
    } else {
        return <div style={{ flexGrow: 1 }}>{props.children}</div>;
    }
}
