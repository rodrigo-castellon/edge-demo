import ListGroup from "react-bootstrap/ListGroup";

export function SongQueue(props) {
    console.log(props.queue);

    const queue = [props.queue[props.queue.length - 1]].concat(
        props.queue.slice(0, 2)
    );
    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" active>
                Songs
            </ListGroup.Item>
            {queue.map((item) => (
                <ListGroup.Item as="li">{item.split("/")[1]} </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
