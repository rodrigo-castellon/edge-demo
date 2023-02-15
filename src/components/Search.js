import React, { useState } from "react";
import "./SearchStyle.css";

function Search({}) {
    const [searchField, setSearchField] = useState("");

    const handleChange = (e) => {
        setSearchField(e.target.value);
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

    return (
        <section style={{ width: "100%" }}>
            <div className="pa2" style={{ width: "100%" }}>
                <input
                    className="searchbar"
                    type="search"
                    placeholder="Youtube Search"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: "100%",
                        backgroundColor: "rgba(77, 77, 77, 0.5)",
                    }}
                />
            </div>
        </section>
    );
}

export default Search;
