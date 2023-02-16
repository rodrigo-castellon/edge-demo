// store just the background queue in the cache
const TITLE_CACHE = {
    niewe7xfoWs: "Dua Lipa - Levitating Feat. DaBaby",
    nsXwi67WgOo: "Lil Nas X - MONTERO (Call Me By Your Name) (Lyrics)",
    OPf0YbXqDm0: "Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars",
    q0KZuZF01FA: "Andrew Belle - In My Veins - Official Song",
    qK5KhQG06xU: "Katrina And The Waves - Walking On Sunshine (Lyrics)",
    qw7WNwMyagw: "Kenny Loggins- Footloose (lyrics)",
    Rfr9bhSmfXc:
        "Kylie Minogue - Can't Get You Out Of My Head (Official Video)",
    s__rX_WL100: "Madonna - Like A Virgin (Official Video)",
    SwYN7mTi6HM: "Van Halen - Jump (Official Music Video)",
    uSD4vsh1zDA: "The Black Eyed Peas - I Gotta Feeling (Official Music Video)",
    ViwtNLUqkMY: "Beyoncé - Crazy In Love ft. JAY Z",
    VJ2rlci9PE0: "Ed Sheeran - Shape of You (Lyrics)",
    "XnAB7kJEO-Y": "Usher - Yeah! (Official Music Video) ft. Lil Jon, Ludacris",
    yURRmWtbTbo:
        "Michael Jackson - Don’t Stop 'Til You Get Enough (Official Video)",
    Zi_XLOBDo_Y: "Michael Jackson - Billie Jean (Official Video)",
    "1sqE6P3XyiQ": "You Should Be Dancing",
    "-CCgDvUM4TM": "Chubby Checker - The Twist (Official Music Video)",
    "2RicaUqd9Hg": "Twist And Shout (Remastered 2009)",
    "3gMG_FZMavU": "Britney Spears - Baby one more time (lyrics)",
    "6lxBcKB3Ohc": "Sia - Cheap Thrills (Lyrics) ft. Sean Paul",
    "8Jtokmp8zoE": "I Can't Help Myself (Sugar Pie, Honey Bunch)",
    "9i6bCWIdhBw": "Le Freak (2006 Remaster)",
    "9KhbM2mqhCQ":
        "Martha Reeves & the Vandellas - Dancing in the Street (1964)",
    "9vMLTcftlyI": "Lil Nas X - HOLIDAY (Official Video)",
    ABfQuZqq8wg: "Ain't No Mountain High Enough",
    BerNfXSuvJ0: "Justin Bieber - Sorry (Lyrics)",
    BRG03PZXo2w: "Doja Cat - Kiss Me More (Lyrics) ft. SZA",
    g7X9X6TlrUo: "Doja Cat - Woman (Lyrics)",
    god7hAPv8f0: "Earth, Wind & Fire - Boogie Wonderland (Official Video)",
    HCq1OcAEAm0: "Lil Nas X - Industry Baby (Lyrics) ft. Jack Harlow",
    I_izvAbhExY: "Bee Gees - Stayin' Alive (Official Video)",
    JYIaWeVL1JM: "SNAP! - Rhythm Is A Dancer (Official Video)",
    LOZuxwVk7TU: "Britney Spears - Toxic (Official HD Video)",
    LPYw3jXjd74: "Macarena - Original version",
};

let AUDIO_CACHE = {};

export const fetchTitle = async (videoid) => {
    if (Object.keys(TITLE_CACHE).includes(videoid)) {
        return TITLE_CACHE[videoid];
    } else {
        const titleResponse = await fetch(
            "/api/youtube_title?videoid=" + videoid
        ).then((response) => response.json());

        const title = titleResponse.message;
        return title;
    }
};

export const fetchAudioObj = async (videoid) => {
    let url =
        "https://storage.googleapis.com/edging-background/v1/mp3/" +
        videoid +
        ".mp3";

    if (Object.keys(AUDIO_CACHE).includes(url)) {
        return AUDIO_CACHE[url];
    }

    // cache miss
    const blob = await fetch(url).then((response) => response.blob());

    const audioURL = window.URL.createObjectURL(blob);
    let newAudio = new Audio(audioURL);

    AUDIO_CACHE[url] = newAudio;

    return newAudio;
};
