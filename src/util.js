export const fetchTitle = async (videoid) => {
    const titleResponse = await fetch(
        "/api/youtube_title?videoid=" + videoid
    ).then((response) => response.json());

    const title = titleResponse.message;
    return title;
};

export const fetchAudioObj = async (videoid) => {
    const blob = await fetch(
        "https://storage.googleapis.com/edging-background/v1/mp3/" +
            videoid +
            ".mp3"
    ).then((response) => response.blob());

    const audioURL = window.URL.createObjectURL(blob);
    let newAudio = new Audio(audioURL);

    return newAudio;
};
