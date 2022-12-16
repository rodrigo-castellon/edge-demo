import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <Navbar bg="dark" variant="dark">
        <Container>
                <Navbar.Brand as={Link} to="/">
                <img
                        alt=""
                        src="https://react-bootstrap.github.io/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                />{' '}
                Endless Dancer
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                </Nav>
        </Container>
    </Navbar>
    );
}