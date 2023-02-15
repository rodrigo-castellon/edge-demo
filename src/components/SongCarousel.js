import React, { useState } from "react";
import * as BiIcons from "react-icons/bi";
import "./SongCarouselStyle.css";

function PlayPauseSVG({ isPlaying }) {
    let playPauseSVG = null;
    if (isPlaying) {
        playPauseSVG = (
            <svg
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
}) => {
    return (
        <div>
            <div
                className="centered-elems-container"
                style={{ overflow: "hidden" }}
            >
                <img
                    src={albumCovers[0]}
                    alt="Previous Song"
                    className="left-song"
                />
                <img src={albumCovers[1]} alt="Current Song" className="song" />
                <img
                    src={albumCovers[2]}
                    alt="Next Song"
                    className="right-song"
                />
            </div>
            <div className="centered-elems-container">
                <p className="title" color={"white"}>
                    {currentSong || "\u00a0"}
                </p>
            </div>
            <div className="centered-elems-container">
                <button className="button" onClick={prevSongHandler}>
                    <svg
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
                <button className="button" onClick={playHandler}>
                    <PlayPauseSVG isPlaying={isPlaying} />
                </button>
                <button className="button" onClick={nextSongHandler}>
                    <svg
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
                    {/* <BiIcons.BiSkipNext /> */}
                </button>
            </div>
        </div>
    );
};

export default SongCarousel;
