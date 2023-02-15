// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Panel from "../../components/Panel";
import SongCarousel from "../../components/SongCarousel";
import React, { useEffect } from "react";
import Loading from "react-fullscreen-loading";
import { useGLTF } from "@react-three/drei";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.nextSongHandler = this.nextSongHandler.bind(this);
        this.prevSongHandler = this.prevSongHandler.bind(this);
        this.playHandler = this.playHandler.bind(this);

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
                        // get the first musics: download and save to our dictionary
                        fetch(
                            "https://storage.googleapis.com/edging-background/v1/mp3/" +
                                queue[0].split("/")[1] +
                                ".mp3"
                        ).then((response) => {
                            response.blob().then((blob) => {
                                const audioURL =
                                    window.URL.createObjectURL(blob);

                                this.setState(function (state, props) {
                                    return {
                                        ready: true,
                                        queue: queue,
                                        queueTitles: titles,
                                        // audioMap: audioMap,
                                        audio: new Audio(audioURL),
                                        // ["audioMap/" + queue[queue.length - 1]]:
                                        //     new Audio(preloadAudioURLs[0]),
                                        // ["audioMap/" + queue[0]]: new Audio(
                                        //     preloadAudioURLs[1]
                                        // ),
                                        // ["audioMap/" + queue[1]]: new Audio(
                                        //     preloadAudioURLs[2]
                                        // ),
                                    };
                                });
                            });
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
            audioMap: null,
            playing: false,
            // number of seconds elapsed since the beginning of the
            // clip
            currentTimestamp: 0,
            // absolute unix time for when playing started (can be
            // false)
            playStartTimestamp: 0,
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

        fetch(
            "https://storage.googleapis.com/edging-background/v1/mp3/" +
                this.state.queue[this.state.queue.length - 1].split("/")[1] +
                ".mp3"
        ).then((response) => {
            response.blob().then((blob) => {
                const audioURL = window.URL.createObjectURL(blob);

                this.setState(function (state, props) {
                    state.audio.pause();
                    let newAudio = new Audio(audioURL);

                    newAudio.play();

                    return {
                        queueTitles: [
                            state.queueTitles[state.queueTitles.length - 1],
                        ].concat(state.queueTitles.slice(0, -1)),
                        queue: [state.queue[state.queue.length - 1]].concat(
                            state.queue.slice(0, -1)
                        ),
                        // this will be overwritten on playHandler() anyways...
                        playStartTimestamp: -1,
                        currentTimestamp: 0,
                        audio: newAudio,
                    };
                });
            });
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

        console.log(this.state.audioMap);

        fetch("/api/next_song", requestOptions);

        fetch(
            "https://storage.googleapis.com/edging-background/v1/mp3/" +
                this.state.queue[1].split("/")[1] +
                ".mp3"
        ).then((response) => {
            response.blob().then((blob) => {
                const audioURL = window.URL.createObjectURL(blob);

                this.setState(function (state, props) {
                    state.audio.pause();
                    let newAudio = new Audio(audioURL);

                    newAudio.play();

                    return {
                        queueTitles: state.queueTitles
                            .slice(1)
                            .concat([state.queueTitles[0]]),
                        queue: state.queue.slice(1).concat([state.queue[0]]),
                        playStartTimestamp: Date.now(),
                        currentTimestamp: 0,
                        // this will be overwritten on playHandler() anyways...
                        audio: newAudio,
                    };
                });
            });
        });
    }

    playHandler() {
        if (!this.state.playing) {
            // play the audio
            var resp = this.state.audio.play();

            this.setState(function (state, props) {
                return {
                    playing: true,
                    playStartTimestamp: Date.now() - state.currentTimestamp,
                };
            });
        } else {
            var resp = this.state.audio.pause();

            this.setState(function (state, props) {
                return {
                    playing: false,
                    currentTimestamp: Date.now() - state.playStartTimestamp,
                };
            });
        }
        console.log("resp was", resp);

        if (resp !== undefined) {
            resp.then((_) => {
                console.log("auto play starts!!");
                // autoplay starts!
            }).catch((error) => {
                console.log(error);
                //show error
            });
        } else {
            console.log("response was undefined!!");
        }
    }

    render() {
        const elementsStyle = {
            width: "75%",
            margin: "auto",
            fontFamily: "Montserrat",
        };

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
                            fontFamily: "Montserrat",
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
                            playElement={this.state.playing}
                            startTimestamp={this.state.currentTimestamp / 1000}
                        />
                    </div>
                    <Panel>
                        <h1>Incredible Title</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla efficitur id ipsum vitae mollis.
                            Phasellus luctus libero ut nisi auctor vestibulum.
                            Cras pulvinar augue non risus dictum ornare. Ut at
                            fringilla enim. Quisque eu egestas urna, et pretium
                            tortor. Etiam arcu magna, varius eu sagittis vel,
                            vestibulum in mi. Nullam ac ultricies sem. Mauris at
                            magna ut magna scelerisque commodo.
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
                            border: "0px solid #ccc",
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
                            playHandler={this.playHandler}
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
