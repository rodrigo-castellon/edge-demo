import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// custom components
import NavbarCustom from "./components/NavbarCustom";

// custom pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";

import { MantineProvider } from "@mantine/core";

function App() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Router>
                <NavbarCustom />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/about" element={<About />} />
                </Routes>
            </Router>
        </MantineProvider>
    );
}

export default App;
