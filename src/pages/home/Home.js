// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import { Button } from "@mantine/core";
import React from "react";
import { useGLTF } from "@react-three/drei";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleClicks = this.handleClicks.bind(this);

        this.files = [
            "/test_toxic2_out/test_toxic2-transformed.glb",
            "/toxic_slow_out/toxic_slow-transformed.glb",
        ];

        // this.files = [
        //     "/test_toxic2_out/test_toxic2.gltf",
        //     "/toxic_slow_out/toxic_slow.gltf",
        // ];

        // // preload everything to make things fast
        // for (const fpath of this.files) {
        //     useGLTF.preload(fpath);
        // }

        this.state = { pathIdx: 0 };
    }

    handleClicks() {
        this.setState(function (state, props) {
            return { pathIdx: (state.pathIdx + 1) % this.files.length };
        });
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

        return (
            <div style={backgroundstyle}>
                <div style={elementsStyle}>
                    <Search />
                    <Button onClick={this.handleClicks}>Next Song</Button>
                    <Display path={this.files[this.state.pathIdx]} />
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
