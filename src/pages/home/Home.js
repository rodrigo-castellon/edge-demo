// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Panel from "../../components/Panel";
import SongCarousel from "../../components/SongCarousel";
import React from "react";

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

                const promises = queue.map((item) => {
                    const apiKey = "AIzaSyCf78Sm0soXX8XZA1IGSC0UBLS5aCAzmug";
                    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${
                        item.split("/")[1]
                    }&key=${apiKey}&part=snippet`;

                    // console.log("GETTING FROM APIURL=", apiUrl);

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
                            console.log("THE QUEUETITLES ARE", titles);
                            return {
                                queue: queue,
                                queueTitles: titles,
                            };
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                // this.setState(function (state, props) {
                //     return {
                //         queue: queue,
                //     };
                // });
            })
            .catch((error) => console.error(error));

        this.state = {
            queue: ["background/1sqE6P3XyiQ"],
            queueTitles: ["You Should Be Dancing"],
            // startTime: -1,
        };
    }

    prevSongHandler() {
        // check time and see if we're close to the beginning
        console.log("going to previous clip");
        const requestOptions = {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ title: "React POST Request Example" }),
        };

        fetch("/api/prev_song", requestOptions).then((data) => {
            console.log(data);
        });

        this.setState(function (state, props) {
            return {
                queueTitles: [
                    state.queueTitles[state.queueTitles.length - 1],
                ].concat(state.queueTitles.slice(0, 2)),
                queue: [state.queue[state.queue.length - 1]].concat(
                    state.queue.slice(0, 2)
                ),
            };
        });
    }

    nextSongHandler() {
        // tell firebase we're onto the next song
        const requestOptions = {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ title: "React POST Request Example" }),
        };

        fetch("/api/next_song", requestOptions)
            // .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });

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

        // const threeSongs = this.state.queue.slice(0, 2)
        const threeSongs = [
            this.state.queue[this.state.queue.length - 1],
        ].concat(this.state.queue.slice(0, 2));

        const albumCovers = threeSongs.map((song) => {
            return (
                "https://img.youtube.com/vi/" + song.split("/")[1] + "/0.jpg"
            );
        });

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
            </div>
        );
    }
}

// export default function Home() {}
