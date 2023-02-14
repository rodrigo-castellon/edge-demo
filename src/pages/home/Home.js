// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import { Button } from "@mantine/core";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { SongQueue } from "../../components/SongQueue";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleClicks = this.handleClicks.bind(this);

        // ask firebase for linked list
        fetch("/api/get_linked_list")
            .then((response) => response.json())
            .then((data) => {
                let queue = JSON.parse(data.message);
                this.setState(function (state, props) {
                    return {
                        queue: queue,
                    };
                });
            })
            .catch((error) => console.error(error));

        this.state = {
            queue: ["background/test_aint_no_mountain_high_enough"],
        };
    }

    handleClicks() {
        // tell firebase we're onto the next song
        const requestOptions = {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ title: "React POST Request Example" }),
        };

        fetch("/api/finish_song", requestOptions)
            // .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });

        this.setState(function (state, props) {
            return {
                queue: state.queue.slice(1).concat([state.queue[0]]),
            };
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
                    <SongQueue queue={this.state.queue} />
                    <Display
                        path={
                            "https://storage.googleapis.com/edging-background/v1/glb/" +
                            this.state.queue[0].split("/")[1] +
                            ".glb"
                        }
                    />
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
