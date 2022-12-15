import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Home() {
    return (
        <Navbar bg="dark" variant="dark">
        <Container>
                <Navbar.Brand href="#home">
                <img
                        alt=""
                        src="https://react-bootstrap.github.io/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                />{' '}
                EDGE: Editable Dance Generation From Music
                </Navbar.Brand>
        </Container>
    </Navbar>
    );
}