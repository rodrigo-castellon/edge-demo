// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Panel from "../../components/Panel";
import SongCarousel from "../../components/SongCarousel";
import React from "react";
import Loading from "react-fullscreen-loading";
import { useGLTF } from "@react-three/drei";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.nextSongHandler = this.nextSongHandler.bind(this);
        this.prevSongHandler = this.prevSongHandler.bind(this);

        // AIzaSyCf78Sm0soXX8XZA1IGSC0UBLS5aCAzmug

        // ask firebase for linked list
        fetch("/api/get_linked_list")
            .then((response) => response.json())
            .then((data) => {
                let queue = JSON.parse(data.message);

                // preload to make things fast
                // let idxToPreload = [queue.length - 1, 0, 1];
                // for (const idx of idxToPreload) {
                //     useGLTF.preload(
                //         "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
                //             queue[idx].split("/")[1] +
                //             ".glb"
                //     );
                // }

                const promises = queue.map((item) => {
                    const apiKey = "AIzaSyCf78Sm0soXX8XZA1IGSC0UBLS5aCAzmug";
                    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${
                        item.split("/")[1]
                    }&key=${apiKey}&part=snippet`;

                    return fetch(apiUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            // console.log("THE DATA HERE IS", data);
                            return data.items[0].snippet.title;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });

                Promise.all(promises)
                    .then((titles) => {
                        this.setState(function (state, props) {
                            return {
                                ready: true,
                                queue: queue,
                                queueTitles: titles,
                            };
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => console.error(error));

        this.state = {
            queue: ["background/1sqE6P3XyiQ"],
            queueTitles: ["You Should Be Dancing"],
            ready: false,
        };
    }

    prevSongHandler() {
        // check time and see if we're close to the beginning
        const requestOptions = {
            method: "POST",
        };

        fetch("/api/prev_song", requestOptions);

        // preload to make things fast
        useGLTF.preload(
            "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
                this.state.queue[this.state.queue.length - 2].split("/")[1] +
                ".glb"
        );

        this.setState(function (state, props) {
            return {
                queueTitles: [
                    state.queueTitles[state.queueTitles.length - 1],
                ].concat(state.queueTitles.slice(0, -1)),
                queue: [state.queue[state.queue.length - 1]].concat(
                    state.queue.slice(0, -1)
                ),
            };
        });
    }

    nextSongHandler() {
        // tell firebase we're onto the next song
        const requestOptions = {
            method: "POST",
        };

        // preload to make things fast
        useGLTF.preload(
            "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
                this.state.queue[2].split("/")[1] +
                ".glb"
        );

        fetch("/api/next_song", requestOptions);

        this.setState(function (state, props) {
            return {
                queueTitles: state.queueTitles
                    .slice(1)
                    .concat([state.queueTitles[0]]),
                queue: state.queue.slice(1).concat([state.queue[0]]),
            };
        });
    }

    render() {
        const elementsStyle = {
            width: "75%",
            margin: "auto",
        };

        // const threeSongs = this.state.queue.slice(0, 2)
        const threeSongs = [
            this.state.queue[this.state.queue.length - 1],
        ].concat(this.state.queue.slice(0, 2));

        const albumCovers = threeSongs.map((song) => {
            return (
                "https://img.youtube.com/vi/" + song.split("/")[1] + "/0.jpg"
            );
        });

        if (this.state.ready) {
            return (
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
                                "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
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
                    <div
                        style={{
                            position: "absolute",
                            margin: "20px",
                            top: 0,
                            right: 0,
                            // height: "25%",
                            width: "25%",
                            background: "rgba(72, 72, 72, 0.3)",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            color: "white",
                            padding: "10px",
                        }}
                    >
                        <SongCarousel
                            currentSong={this.state.queueTitles[0]}
                            // currentArtistName={"Britney Spears"}
                            albumCovers={albumCovers}
                            nextSongHandler={this.nextSongHandler}
                            prevSongHandler={this.prevSongHandler}
                        ></SongCarousel>
                    </div>
                </div>
            );
        } else {
            return (
                <Loading
                    loading={true}
                    background="#404040"
                    loaderColor="#3498db"
                />
            );
        }
    }
}

// export default function Home() {}
