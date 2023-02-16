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
                    return item.channelTitle + " - " + item.title;
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
    const divElements = searchResults.map((string, index) => (
        <div
            style={{
                backgroundColor: "darkgrey",
                padding: "0px",
                margin: "0px",
                height: "3vh",
                width: "100%",
            }}
            key={index}
        >
            <p className="result">{string}</p>
        </div>
    ));

    return (
        <section style={{ width: "100%" }}>
            <div className="pa2" style={{ width: "100%" }}>
                <input
                    className="searchbar"
                    type="search"
                    placeholder=""
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: "100%",
                        backgroundColor: "rgba(77, 77, 77, 0.5)",
                    }}
                />
                {divElements}
            </div>
        </section>
    );
}

export default Search;
