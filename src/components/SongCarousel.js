import React, { useState } from "react";

const SongCarousel = ({ currentSongName, currentArtistName, albumCovers }) => {
    // const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        console.log("previous!");
        // setCurrentIndex(
        //     currentIndex === 0 ? songs.length - 1 : currentIndex - 1
        // );
    };

    const handleNext = () => {
        console.log("next!");
        // setCurrentIndex(
        //     currentIndex === songs.length - 1 ? 0 : currentIndex + 1
        // );
    };

    return (
        <div>
            <div>
                <img
                    src={albumCovers[0]}
                    alt="Previous Song"
                    style={{ width: "100px", height: "100px" }}
                />
                <img
                    src={albumCovers[1]}
                    alt="Current Song"
                    style={{ width: "100px", height: "100px" }}
                />
                <img
                    src={albumCovers[2]}
                    alt="Next Song"
                    style={{ width: "100px", height: "100px" }}
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
