import React, { useState } from 'react';

function Search({ }) {

    const [searchField, setSearchField] = useState("");

    const handleChange = e => {
        setSearchField(e.target.value);
    };

    function handleKeyDown(e) {
        if (e.which == 13) {
            const link = e.target.value;

            // make request to server
            const response = fetch("http://localhost:8080/api/request_song?link=" + link, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            }
            );
        }
    }

    return (
        <section style={{width: "100%"}}>
            <div className="pa2" style={{width: "100%"}}>
                <input 
                    className="pa3 bb br3 b--none bg-lightest-blue ma3"
                    type = "search" 
                    placeholder = "Youtube Link"
                    onChange = {handleChange}
                    onKeyDown = {handleKeyDown}
                    style={{width: "100%"}}
                />
            </div>
        </section>
    );
}

export default Search;