import React, { useState } from "react";
import "./SearchStyle.css";

function Search({}) {
    const [searchField, setSearchField] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (e) => {
        setSearchField(e.target.value);

        // get the
        fetch("/api/youtube_autocomplete?query=" + e.target.value)
            .then((response) => response.json())
            .then((data) => {
                let titles = data.message.map((item) => {
                    return [item.channelTitle, item.title];
                });
                setSearchResults(titles);
            });
    };

    function handleKeyDown(e) {
        if (e.which == 13) {
            const link = e.target.value;

            // make request to server
            const response = fetch("/api/request_song?link=" + link, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                });
        }
    }

    const divElements = searchResults.map(([channel, title], index) => {
        let extraClass = "";
        if (index === 0) {
            extraClass = "round-top";
        } else if (index === searchResults.length - 1) {
            extraClass = "round-bottom";
        }

        console.log(extraClass);

        return (
            <div
                className={`result-div ${extraClass}`}
                style={{ userSelect: "none" }}
                key={index}
            >
                <p className="result" style={{ userSelect: "none" }}>
                    <span className="boldtext">[{channel}]</span>{" "}
                    <span>{title}</span>
                </p>
            </div>
        );
    });

    return (
        <section style={{ width: "100%" }}>
            <div
                // className="results-container"
                style={{
                    width: "100%",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <div style={{ height: "1vh" }}></div>
                <input
                    className="searchbar"
                    type="search"
                    placeholder="Search / Youtube URL"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <div
                    style={{
                        height: "1vh",
                    }}
                ></div>
                <div className="results-container">{divElements}</div>
            </div>
        </section>
    );
}

export default Search;
