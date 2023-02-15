// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Panel from "../../components/Panel";
import { Button } from "@mantine/core";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { SongQueue } from "../../components/SongQueue";
import { ReactSlider } from "react-awesome-slider";

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
        // const [showSlider, setShowSlider] = useState(false);
        const backgroundstyle = {
            // width: "100%",
            // minHeight: "calc(100vh - 80px)",
            // height: "auto",
            // display: "flex",
            // flexDirection: "column",
            // align-items: "center",
            // paddingTop: "20px",
            // paddingBottom: "20px",
            // color: "white",
            // backgroundColor: "#121417",
        };

        const elementsStyle = {
            width: "75%",
            margin: "auto",
        };

        const elementStyle = {
            padding: "20px",
            position: "relative",
        };

        console.log(Panel);

        return (
            <div style={backgroundstyle}>
                <div style={elementsStyle}>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Display
                            path={
                                "https://storage.googleapis.com/edging-background/v1/glb/" +
                                this.state.queue[0].split("/")[1] +
                                ".glb"
                            }
                        />
                    </div>
                    <Panel>
                        <h1>Incredible Title</h1>
                        <p>
                            Made with EDGE. See https://edge-dance.github.io/.
                        </p>
                        <Search />
                    </Panel>
                </div>
            </div>
        );
    }
}

// export default function Home() {}
