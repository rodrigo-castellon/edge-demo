import React from "react";

// custom pages
import Home from "./pages/home/Home";
import { Helmet } from "react-helmet";
import "./main.css";

// https://fonts.googleapis.com/css?family=Montserrat
function App() {
    return (
        <div>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Montserrat"
                ></link>
            </Helmet>
            <Home />
        </div>
    );
}

export default App;
