// Test if image loads
const img = new Image();
img.onload = () => console.log("Image loaded successfully");
img.onerror = () => console.log("Image failed to load");
img.src = "../assets/images/farhanKhan.jpeg";

// Main page Selectors
let createPlaylistBtn = document.getElementById("create-playlist");
let playListCards = document.querySelectorAll(".card");
let audioPlayer = document.getElementById("audio-player");

// Banner page Selectors
let songTitleInBanner = document.getElementById("song-title-in-banner");
let artistNameBanner = document.getElementById("artist-name-banner");
let songDuration = document.getElementById("song-duration");
let songArtistImg = document.getElementById("song-artist-img");
let songOrPlaylistImgBanner = document.getElementById("songOrPlaylist-img");
let songListContainer = document.getElementById("song-lists");

// Button Selectors
let backBtn = document.getElementById("back-button");

// Toggle Selectors
let songBannerPage = document.getElementById("song-banner-page");
let songMainPage = document.getElementById("main");

// Back button logic
backBtn.addEventListener("click", () => {
  songBannerPage.classList.add("hidden");
  songMainPage.classList.remove("hidden");
  backBtn.classList.add("hidden");
});

// Program Goes from here......................
async function loadBanner(playListId) {
  const res = await fetch("data/playlist.json");
  const playLists = await res.json();
  // console.log(playLists)

  // Find the playlist by Id
  const playList = playLists.find((pl) => pl.id === playListId);
  console.log(playList);

  if (playList) {
    songOrPlaylistImgBanner.src = playList.cover;
    songTitleInBanner.textContent = playList.title;
  }
}
playListCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    const playListID = parseInt(card.dataset.id);
    console.log("Clicked playList Cards", playListID);
    songBannerPage.classList.remove("hidden");
    songMainPage.classList.add("hidden");
    backBtn.classList.remove("hidden");
    loadBanner(playListID);
    renderSongs(playListID);
  });
});

// Song.json
const res = await fetch("data/songs.json");
const songData = await res.json();
console.log(songData);

async function renderSongs(playListID) {
  const playListSong = songData.filter(
    (song) => song.playListId === playListID
  );
  console.log(playListSong);

  songListContainer.innerHTML = "";

  playListSong.forEach((song) => {
    let songRow = document.createElement("div");
    songRow.className = "songList-row";
    songRow.innerHTML = `
            <div class="cell">${song.count}</div>
            <div class="cell">${song.title}</div>
            <div class="cell">${song.artistName}</div>
            <div class="cell">${song.duration}</div>
            `;

    songListContainer.appendChild(songRow);
    // Play song Even trigger
    songRow.addEventListener("click", () => {
      playSong(song.id);
    });
  });
}

// Api
const bucketUrl = import.meta.env.VITE_BUCKET_URL;

async function playSong(songId) {
  console.log(songId);
  const songToPlay = songData.find((song) => song.id === songId);
  console.log(songToPlay);
  
  if (songToPlay) {
    // Construct the direct audio URL
    const audioUrl = `${bucketUrl}/${songToPlay.songAddress}`;
    console.log(`Playing: ${audioUrl}`);
    
    // Create and play audio
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  } else {
    console.error("Song not found:", songId);
  }
}

// async function fetchPlaylist(songTitle) {
//   try {
//     const fullUrl = `/${bucketUrl}/${songTitle}`;
//     console.log(`Fetching from: ${fullUrl}`);

//     const response = await fetch(fullUrl);
//     const data = await response.json();

//     console.log("Successfully fetched song:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching the song:", error);
//   }
// }
