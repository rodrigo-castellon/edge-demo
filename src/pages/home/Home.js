// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Nextsong from "../../components/Nextsong";
import { Button } from "@mantine/core";
import React from "react";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleClicks = this.handleClicks.bind(this);

        this.main = "/test_toxic2_out/test_toxic2-transformed.glb";
        this.alternate = "/test_toxic3_out/test_toxic3-transformed.glb";
        this.alternate = "hiphop2_out/hiphop2-transformed.glb";
        this.alternate = "spin_out/spin-transformed.glb";
        this.alternate = "wave_out/wave-transformed.glb";
        this.alternate = "toxic_upright_out/toxic_upright-transformed.glb";
        this.alternate = "toxic_slow_out/toxic_slow-transformed.glb";

        // this.state = { path: "/test_toxic2_out/test_toxic2-transformed.glb" };
        this.state = { path: this.alternate };
    }

    handleClicks() {
        this.setState(function (state, props) {
            if (state.path == this.main) {
                return { path: this.alternate };
            } else {
                return { path: this.main };
            }
        });

        // if (this.path == "/test_toxic2_out/test_toxic2-transformed.glb") {
        //     this.path = "/test_toxic3_out/test_toxic3-transformed.glb";
        // } else {
        //     this.path = "/test_toxic2_out/test_toxic2-transformed.glb";
        // }
    }

    render() {
        const backgroundstyle = {
            // width: "100%",
            // minHeight: "calc(100vh - 80px)",
            // height: "auto",
            // display: "flex",
            // flexDirection: "column",
            // align-items: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
            color: "white",
            backgroundColor: "#121417",
        };

        const elementsStyle = {
            width: "75%",
            margin: "auto",
        };

        const elementStyle = {
            padding: "20px",
        };

        // if (this.state.path === this.main) {
        // }

        return (
            <div style={backgroundstyle}>
                <div style={elementsStyle}>
                    <Search />
                    <Button onClick={this.handleClicks}>Next Song</Button>
                    <Display path={this.state.path} />
                    <p style={elementStyle}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </p>
                </div>
            </div>
        );
    }
}

// export default function Home() {}
