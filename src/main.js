// Test if image loads
const img = new Image();
img.onload = () => console.log("Image loaded successfully");
img.onerror = () => console.log("Image failed to load");
img.src = "../assets/images/farhanKhan.jpeg";

// Main page Selectors
let createPlaylistBtn = document.getElementById("create-playlist");
let playListCards = document.querySelectorAll(".card");

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
    const id = parseInt(card.dataset.id);
    console.log("Clicked playList Cards", id);
    songBannerPage.classList.remove("hidden");
    songMainPage.classList.add("hidden");
    backBtn.classList.remove("hidden");
    loadBanner(id);
    renderSongs(id);
  });
});

async function renderSongs(playListId) {
  const res = await fetch("data/songs.json");
  const songsFetched = await res.json();
  console.log(songsFetched);

  const songList = songsFetched.filter(
    (song) => song.playListId === playListId
  );
  songListContainer.innerHTML = "";
  songList.forEach((song) => {
    console.log(song);
    let songRow = document.createElement("div");
    songRow.className = "songList-row";
    songRow.innerHTML = `
          <div class="cell">${song.id}</div>
          <div class="cell">${song.title}</div>
          <div class="cell">${song.artistName}</div>
          <div class="cell">${song.duration}</div>
    `;
    songListContainer.appendChild(songRow);
  });
}
