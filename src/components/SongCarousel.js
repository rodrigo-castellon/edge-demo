import React, { useState } from "react";
import * as BiIcons from "react-icons/bi";
import "./SongCarouselStyle.css";

const SongCarousel = ({
    currentSong,
    albumCovers,
    prevSongHandler,
    nextSongHandler,
    playHandler,
}) => {
    // cut the current song name short if it's too long

    return (
        <div>
            <div className="centered-elems-container">
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
                <button onClick={prevSongHandler}>
                    <BiIcons.BiSkipPrevious />
                </button>
                <button onClick={playHandler}>
                    <BiIcons.BiPlay />
                </button>
                <button onClick={nextSongHandler}>
                    <BiIcons.BiSkipNext />
                </button>
            </div>
        </div>
    );
};

export default SongCarousel;
