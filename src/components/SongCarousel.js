import React, { useState } from "react";
import * as BiIcons from "react-icons/bi";
import "./SongCarouselStyle.css";

const SongCarousel = ({ currentSongName, currentArtistName, albumCovers }) => {
    // const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        console.log("previous!");
    };

    const handleNext = () => {
        console.log("next!");
    };

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
                <p color={"white"}>
                    {currentArtistName} - {currentSongName}
                </p>
            </div>
            <div className="centered-elems-container">
                <button onClick={handlePrevious}>
                    <BiIcons.BiSkipPrevious />
                </button>
                <button>
                    <BiIcons.BiPlay />
                </button>
                <button onClick={handleNext}>
                    <BiIcons.BiSkipNext />
                </button>
            </div>
        </div>
    );
};

export default SongCarousel;
