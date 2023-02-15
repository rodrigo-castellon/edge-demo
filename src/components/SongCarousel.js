import React, { useState } from "react";
import * as BiIcons from "react-icons/bi";
import "./SongCarouselStyle.css";

const SongCarousel = ({
    currentSong,
    albumCovers,
    prevSongHandler,
    nextSongHandler,
}) => {
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
                <p color={"white"}>{currentSong}</p>
            </div>
            <div className="centered-elems-container">
                <button onClick={prevSongHandler}>
                    <BiIcons.BiSkipPrevious />
                </button>
                <button>
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
