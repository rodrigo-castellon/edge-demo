import React, { useState } from "react";
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
        <div
            style={{
                backgroundColor: "yellow",
            }}
        >
            <div
                style={{
                    margin: "auto",
                    backgroundColor: "green",
                }}
                className="image-container"
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
            <div>
                <p color={"white"}>
                    {currentSongName} - {currentArtistName}
                </p>
            </div>
            <div>
                <button onClick={handlePrevious}>Previous</button>
                <button>Play</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default SongCarousel;
