import React from 'react';

// routes
// import Router from './routes';
// theme
// import ThemeProvider from './theme';
// components
// import ScrollToTop from './components/scroll-to-top';
// import { StyledChart } from './components/chart';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// custom pages
// import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
// import Settings from "./pages/settings/Settings";
// import Single from "./pages/single/Single";
// import Write from "./pages/write/Write";

// ----------------------------------------------------------------------
function App() {

    return (
        <Router>
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
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/about" element={<About/>} />
            </Routes>
        </Router>
    );
  }


export default App;