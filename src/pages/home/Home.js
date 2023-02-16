// custom components
import Display from "../../components/Display";
import Search from "../../components/Search";
import Panel from "../../components/Panel";
import SongCarousel from "../../components/SongCarousel";
import Arrow from "../../components/Arrow";
import React, { useEffect } from "react";
import Loading from "react-fullscreen-loading";
import { useGLTF } from "@react-three/drei";
import "../../main.css";
import DisappearingDiv from "../../components/DisappearingDiv";
import { fetchTitle, fetchAudioObj } from "../../util.js";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.nextSongHandler = this.nextSongHandler.bind(this);
        this.prevSongHandler = this.prevSongHandler.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.panelHandler = this.panelHandler.bind(this);
        this.nextSongHandlerHelper = this.nextSongHandlerHelper.bind(this);
        // this.fetchTitle = this.fetchTitle.bind(this);
        // this.fetchAudioObj = this.fetchAudioObj.bind(this);
        this.initOurState = this.initOurState.bind(this);

        this.initOurState();

        this.state = {
            queue: ["background/1sqE6P3XyiQ"],
            // queueTitles: ["You Should Be Dancing"],
            queueTitle: "You Should Be Dancing",
            ready: false,
            audioMap: null,
            playing: false,
            // number of seconds elapsed since the beginning of the
            // clip
            currentTimestamp: 0,
            // absolute unix time for when playing started (can be
            // false)
            playStartTimestamp: 0,
            panelActive: true,
        };
    }

    async initOurState() {
        // async because we depend on fetching the audio
        const queue = [
            "background/niewe7xfoWs",
            "background/nsXwi67WgOo",
            "background/OPf0YbXqDm0",
            "background/q0KZuZF01FA",
            "background/qK5KhQG06xU",
            "background/qw7WNwMyagw",
            "background/Rfr9bhSmfXc",
            "background/s__rX_WL100",
            "background/SwYN7mTi6HM",
            "background/uSD4vsh1zDA",
            "background/ViwtNLUqkMY",
            "background/VJ2rlci9PE0",
            "background/XnAB7kJEO-Y",
            "background/yURRmWtbTbo",
            "background/Zi_XLOBDo_Y",
            "background/1sqE6P3XyiQ",
            "background/-CCgDvUM4TM",
            "background/2RicaUqd9Hg",
            "background/3gMG_FZMavU",
            "background/6lxBcKB3Ohc",
            "background/8Jtokmp8zoE",
            "background/9i6bCWIdhBw",
            "background/9KhbM2mqhCQ",
            "background/9vMLTcftlyI",
            "background/ABfQuZqq8wg",
            "background/BerNfXSuvJ0",
            "background/BRG03PZXo2w",
            "background/g7X9X6TlrUo",
            "background/god7hAPv8f0",
            "background/HCq1OcAEAm0",
            "background/I_izvAbhExY",
            "background/JYIaWeVL1JM",
            "background/LOZuxwVk7TU",
            "background/LPYw3jXjd74",
        ];

        const title = "Dua Lipa - Levitating Feat. DaBaby";

        const blob = await fetch(
            "https://storage.googleapis.com/edging-background/v1/mp3/" +
                queue[0].split("/")[1] +
                ".mp3"
        ).then((response) => {
            return response.blob();
        });

        const audioURL = window.URL.createObjectURL(blob);

        this.setState(function (state, props) {
            return {
                queueTitle: title,
                ready: true,
                queue: queue,
                // queueTitles: titles,
                panelActive: true,
                audio: new Audio(audioURL),
            };
        });
    }

    panelHandler() {
        this.setState(function (state, props) {
            if (state.playing) {
                return {
                    panelActive: !state.panelActive,
                    currentTimestamp: Date.now() - state.playStartTimestamp,
                };
            } else {
                return {
                    panelActive: !state.panelActive,
                    playStartTimestamp: Date.now() - state.currentTimestamp,
                };
            }
        });
    }

    async prevSongHandlerHelper() {
        const title = await fetchTitle(
            this.state.queue[this.state.queue.length - 1].split("/")[1]
        );
        const newAudio = await fetchAudioObj(
            this.state.queue[this.state.queue.length - 1].split("/")[1]
        );

        this.setState(function (state, props) {
            // avoid race condition
            state.audio.pause();
            newAudio.play();
            return {
                ready: true,
                queueTitle: title,
                queue: [state.queue[state.queue.length - 1]].concat(
                    state.queue.slice(0, state.queue.length - 1)
                ),
                // this will be overwritten on playHandler() anyways...
                playStartTimestamp: -1,
                currentTimestamp: 0,
                audio: newAudio,
            };
        });
    }

    prevSongHandler() {
        // preload to make things fast
        useGLTF.preload(
            "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
                this.state.queue[this.state.queue.length - 2].split("/")[1] +
                ".glb"
        );

        this.prevSongHandlerHelper();
    }

    async nextSongHandlerHelper() {
        const title = await fetchTitle(this.state.queue[1].split("/")[1]);
        const newAudio = await fetchAudioObj(this.state.queue[1].split("/")[1]);

        this.setState(function (state, props) {
            // avoid race condition
            state.audio.pause();
            newAudio.play();
            return {
                queueTitle: title,
                queue: state.queue.slice(1).concat([state.queue[0]]),
                // this will be overwritten on playHandler() anyways...
                playStartTimestamp: -1,
                currentTimestamp: 0,
                audio: newAudio,
            };
        });
    }

    nextSongHandler() {
        // preload to make things fast
        useGLTF.preload(
            "https://storage.googleapis.com/edging-background/v1/glb_videoids/" +
                this.state.queue[2].split("/")[1] +
                ".glb"
        );

        this.nextSongHandlerHelper();
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
        console.log("currently the queueTitle is", this.state.queueTitle);
        const elementsStyle = {
            width: "75%",
            margin: "auto",
            fontFamily: "Montserrat",
        };

        const threeSongs = [
            this.state.queue[this.state.queue.length - 1],
        ].concat(this.state.queue.slice(0, 2));

        console.log("this.state.queue[0] in render", this.state.queue[0]);
        const albumCovers = threeSongs.map((song) => {
            return (
                "https://img.youtube.com/vi/" + song.split("/")[1] + "/0.jpg"
            );
        });

        // console.log("AT THIS POINT QUEUETITLES IS", this.state.queueTitles);

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
                                "https://storage.googleapis.com/edging-background/v1/glb_videoids_new/" +
                                this.state.queue[0].split("/")[1] +
                                ".glb"
                            }
                            playElement={this.state.playing}
                            startTimestamp={this.state.currentTimestamp / 1000}
                        />
                    </div>
                    <Panel isActive={this.state.panelActive}>
                        <div
                            style={{
                                display: "flex",
                                padding: "10px",
                            }}
                        >
                            <Arrow
                                panelHandler={this.panelHandler}
                                isActive={this.state.panelActive}
                            />
                            {/* <div style={{ width: "3vh" }}></div> */}
                            {/* https://stackoverflow.com/questions/2637696/how-to-place-div-side-by-side */}
                            <h1
                                style={{
                                    flexGrow: 1,
                                    padding: "0px",
                                    margin: "0px",
                                }}
                            >
                                Groove Genie
                            </h1>
                        </div>
                        <DisappearingDiv disappeared={!this.state.panelActive}>
                            <p>
                                Unleash the magic of music and dance with Groove
                                Genie. Our technology generates custom dancing
                                robot choreographies for any song you choose.
                                Experience mesmerizing moves and stunning
                                visuals like never before. Get started now and
                                let the music take you on a journey!
                            </p>
                        </DisappearingDiv>
                        <div style={{ gridArea: "inner-div" }}>
                            <Search />
                        </div>
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
                            borderRadius: "15px",
                            color: "white",
                            padding: "10px",
                        }}
                    >
                        <SongCarousel
                            currentSong={this.state.queueTitle}
                            // currentArtistName={"Britney Spears"}
                            albumCovers={albumCovers}
                            nextSongHandler={this.nextSongHandler}
                            prevSongHandler={this.prevSongHandler}
                            playHandler={this.playHandler}
                            isPlaying={this.state.playing}
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
