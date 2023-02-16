import React, { useState, useEffect } from "react";
// import * as BiIcons from "react-icons/bi";
import "./SongCarouselStyle.css";

function PlayPauseSVG({ isPlaying }) {
    let playPauseSVG = null;
    if (isPlaying) {
        playPauseSVG = (
            <svg
                className={"SVGButton"}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="3em"
                width="3em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M8 7h3v10H8zm5 0h3v10h-3z"></path>
            </svg>
        );
    } else {
        playPauseSVG = (
            <svg
                className={"SVGButton"}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="3em"
                width="3em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M7 6v12l10-6z"></path>
            </svg>
        );
    }

    return playPauseSVG;
}

const SongCarousel = ({
    currentSong,
    albumCovers,
    prevSongHandler,
    nextSongHandler,
    playHandler,
    isPlaying,
    playStartTimestamp,
    currentTimestamp,
    directingUserAttention,
    currentVideoId,
}) => {
    const [currentTimePercent, setCurrentTimePercent] = useState("0%");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Update the progress bar after 200ms
            if (isPlaying) {
                currentTimestamp = Date.now() - playStartTimestamp;
            }

            setCurrentTimePercent(
                JSON.stringify((100 * (currentTimestamp / 1000)) / 30) + "%"
            );
            // setProgress((prevProgress) => prevProgress + 1);
        }, 10);

        // Clean up the timeout when the component unmounts or the progress state changes
        return () => clearTimeout(timeoutId);
    });

    return (
        <div
            style={{
                position: "absolute",
                margin: "20px",
                top: 0,
                right: 0,
                height: "40%",
                width: "30vw",
                background: "rgba(72, 72, 72, 0.3)",
                border: "0px solid #ccc",
                borderRadius: "15px",
                color: "white",
                padding: "10px",
            }}
        >
            <div
                className="centered-elems-container"
                style={{ overflow: "hidden" }}
            >
                <img
                    src={albumCovers[0]}
                    alt="Previous Song"
                    className="left-song"
                    onClick={prevSongHandler}
                />
                <a
                    href={"https://www.youtube.com/watch?v=" + currentVideoId}
                    target="_blank"
                >
                    <img
                        src={albumCovers[1]}
                        alt="Current Song"
                        className="song"
                    />
                </a>
                <img
                    src={albumCovers[2]}
                    alt="Next Song"
                    className="right-song"
                    onClick={nextSongHandler}
                />
            </div>
            <div className="centered-elems-container">
                <p className="title" color={"white"}>
                    {currentSong || "\u00a0"}
                </p>
            </div>
            <div
                style={{
                    margin: "auto",
                    width: "75%",
                    height: "2vh",
                    padding: "0px",
                    position: "sticky",
                }}
            >
                <div
                    style={{
                        height: "15%",
                        width: "100%",
                        position: "absolute",
                        top: "42.5%",
                        left: "0",
                        backgroundColor: "rgba(126,133,138,1)",
                        borderColor: "white",
                    }}
                ></div>
                <div
                    style={{
                        height: "15%",
                        width: currentTimePercent,
                        position: "absolute",
                        top: "42.5%",
                        left: "0",
                        backgroundColor: "white",
                        borderColor: "white",
                    }}
                ></div>
                <div
                    style={{
                        height: "100%",
                        width: "2vh",
                        // top was manually fit
                        position: "absolute",
                        top: "0",
                        // top: "-16.5%",
                        left: currentTimePercent,
                        // position: "relative",
                        backgroundColor: "white",
                        borderRadius: "10px",
                    }}
                ></div>
                {/* <p>heyo</p> */}
            </div>
            <div className="centered-elems-container">
                <button className="button" onClick={prevSongHandler}>
                    <svg
                        className={"SVGButton"}
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="3em"
                        width="3em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="m16 7-7 5 7 5zm-7 5V7H7v10h2z"></path>
                    </svg>
                </button>
                <button
                    className={`button ${
                        directingUserAttention ? "button-active" : ""
                    }`}
                    onClick={playHandler}
                >
                    <PlayPauseSVG isPlaying={isPlaying} />
                </button>
                <button className="button" onClick={nextSongHandler}>
                    <svg
                        className={"SVGButton"}
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="3em"
                        width="3em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M7 7v10l7-5zm9 10V7h-2v10z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SongCarousel;
