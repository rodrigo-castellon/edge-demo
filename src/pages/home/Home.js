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
            "https://storage.googleapis.com/edging-background/v1/glb/test_aint_no_mountain_high_enough.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_andrew_belle_in_my_veins_official_song.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_baby_one_more_time_britney_spears_lyrics.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_bee_gees_stayin_alive_official_music_video.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_beyonce_crazy_in_love_ft_jay_z.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_britney_spears_toxic_official_hd_video.glb",
            "https://storage.googleapis.com/edging-background/v1/glb/test_chubby_checker_the_twist_official_music_video.glb",
        ];

        // preload everything to make things fast
        for (const fpath of this.files) {
            useGLTF.preload(fpath);
        }

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
