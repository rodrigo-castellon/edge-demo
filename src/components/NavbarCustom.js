import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


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
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
        </Container>
    </Navbar>
    );
}