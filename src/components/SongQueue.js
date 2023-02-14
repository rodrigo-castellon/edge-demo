import ListGroup from "react-bootstrap/ListGroup";

export function SongQueue(props) {
    console.log(props.queue);
    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" active>
                Up Next
            </ListGroup.Item>
            {props.queue.map((item) => (
                <ListGroup.Item as="li">{item.split("/")[1]} </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
