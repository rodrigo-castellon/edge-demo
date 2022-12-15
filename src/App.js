import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// custom components
import NavbarCustom from "./components/NavbarCustom";

// custom pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";

// ----------------------------------------------------------------------
function App() {

    return (
        <Router>
            <NavbarCustom />
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/about" element={<About/>} />
            </Routes>
        </Router>
    );
  }


export default App;