// Test if image loads
const img = new Image();
img.onload = () => console.log("Image loaded successfully");
img.onerror = () => console.log("Image failed to load");
img.src = "../assets/images/farhanKhan.jpeg";

// Main page Selectors
let createPlaylistBtn = document.getElementById("create-playlist");
let playListCards = document.querySelectorAll(".card");
let audioPlayer = document.getElementById("audio-player");
let playBtn = document.querySelectorAll(".play-btn");
let pauseBtnId = document.getElementById("pause-btn");
let playBtnId = document.getElementById("play-btn");
let nextSongBtn = document.getElementById("next-song");
let previousSong = document.getElementById("previous-song");
let playedSongImgTag = document.getElementById("played-song-img");
let playedSongTitle = document.getElementById("played-song-name")
let playedSongArtist = document.getElementById("Played-song-artist")

// Banner page Selectors
let songTitleInBanner = document.getElementById("song-title-in-banner");
let artistNameBanner = document.getElementById("artist-name-banner");
let songDuration = document.getElementById("song-duration");
let songArtistImg = document.getElementById("song-artist-img");
let songOrPlaylistImgBanner = document.getElementById("songOrPlaylist-img");
let songListContainer = document.getElementById("song-lists");

// Button Selectors
let backBtn = document.getElementById("back-button");
let loader = document.querySelector(".loader");

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

const playlistRes = await fetch("data/playlist.json");
const playLists = await playlistRes.json();
// console.log(playLists)

async function loadBanner(playListId) {
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
// console.log(songData);

async function renderSongs(playListID) {
  console.log("RENDERING GOES HERE--------------");
  const playListSong = songData.filter(
    (song) => song.playListId === playListID
  );
  // console.log(playListSong);

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
      playBtnId.classList.add("hidden");
      pauseBtnId.classList.remove("hidden");
    });
  });
}

// Api
const bucketUrl = import.meta.env.VITE_BUCKET_URL;

let currentAudio = null;
let nextAudio = null;
let previousAudio = null;
let currentSongImg = null;
let isPlaying = false;
let isPaused = false;
let currentSongId = null;
let currentSongData = null;
let currentSongIndex = 0;

function setCurrentSong(songId) {
  currentSongId = songId;
  currentSongIndex = songData.findIndex((song) => song.id === songId);
  currentSongData = songData[currentSongIndex];

  console.log("current song set to ", currentSongData.title);
  console.log("song index ", currentSongData.id);
}

function stopCurrentSong() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    isPlaying = false;
    console.log("previous song stopped");
  }
}

async function playSong(songId) {
  console.log("PLAY SONG GOES HERE--------------");
  console.log("Playing song ID:", songId);
  stopCurrentSong();
  setCurrentSong(songId);

  const songToPlay = songData.find((song) => song.id === songId);
  console.log(songToPlay);

  if (songToPlay) {
    const audioUrl = `${bucketUrl}/${songToPlay.songAddress}`;
    console.log(`Loading: ${audioUrl}`);
    // new Audio.....
    currentAudio = new Audio(audioUrl);
    setupAudioEventListeners();
    try {
      await currentAudio.play();
      isPlaying = true;
      playedSongImg(songId);
      console.log("✅ Song is playing", songToPlay.title);
    } catch (error) {
      currentAudio = null;
      isPlaying = false;
      console.log("Oops! something went wrong:", error);
    }
  } else {
    console.error("Song not found:", songId);
  }
}

async function playedSongImg(songId) {
  const songImgToPlay = songData.find((song) => song.id === songId);
  console.log("Api for image load --------------------");

  if (songImgToPlay) {
    const ImageURL = `${bucketUrl}/${songImgToPlay.cover}`;
    console.log("playingImg ", ImageURL);

    try {
      playedSongImgTag.src = ImageURL;
      playedSongImgTag.onload = () => {
        console.log("Success Loading Played Image ");
        playedSongTitle.textContent = songImgToPlay.title;
        playedSongArtist.textContent = songImgToPlay.artistName;
        loader.classList.add("hidden");
      };
    } catch (error) {
      playedSongImgTag.src = "./assets/images/Tamil01.jpeg";
      console.log("Error fetching Imag:", error);
    }
    loader.classList.remove("hidden");
  }
}

// play pause logic
function togglePlayPause() {
  console.log("PLAY PAUSE TOGGLE GOES HERE--------------");
  // Case 1: No song is selected
  if (!currentSongData) {
    console.log("No song selected");
    return;
  }
  // Case 2: Song is currently Playing => pausing it
  if (isPlaying && currentAudio && !currentAudio.pause()) {
    currentAudio.pause();
    isPlaying = false;
    isPaused = true;
    updatePlayPauseBtn("paused");
    console.log("paused:", currentSongData);

    // Case 3: Song is Paused => Resuming it
  } else if (isPaused && currentAudio) {
    try {
      currentAudio.play();
      isPlaying = true;
      isPaused = false;
      updatePlayPauseBtn("played");
    } catch (error) {
      console.error("Error resuming audio");
    }
  }
  // Case 4: Song is selected but not loaded => start playing
  else if (currentSongId && !isPlaying) {
    playSong(currentSongId);
  }
}
// Play, puase, next and previous btn function
playBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    togglePlayPause();
  });
});

nextSongBtn.addEventListener("click", () => {
  playNextSong();
});

function updatePlayPauseBtn(CurrStatus) {
  if (CurrStatus === "played") {
    playBtnId.classList.add("hidden");
    pauseBtnId.classList.remove("hidden");
  } else if (CurrStatus === "paused") {
    pauseBtnId.classList.add("hidden");
    playBtnId.classList.remove("hidden");
  }
}

function playNextSong() {
  console.log("PLAY NEXT SONG GOES HERE--------------");
  if (currentSongData === null || currentSongIndex === -1) return;

  const currentPlaylistId = currentSongData.playListId;
  console.log(currentPlaylistId);
  const playListSongs = songData.filter(
    (song) => song.playListId === currentPlaylistId
  );
  console.log(playListSongs);
  currentAudio.pause();

  // find the index of the current song in the playList
  const currentIndexInPlayList = playListSongs.findIndex(
    (song) => song.id === currentSongData.id
  );
  console.log(currentIndexInPlayList);

  const nextIndexInPlaylist =
    (currentIndexInPlayList + 2) % playListSongs.length;
  const nextSong = playListSongs[nextIndexInPlaylist];
  console.log("nextIndexInPlaylist", nextIndexInPlaylist);
  console.log("nextSong ", nextSong);

  const nextSongIndex = songData.findIndex((song) => song.id === nextSong.id);

  playSong(nextSongIndex);
}

// function setupAudioEventListeners(){
//   console.log("SETTING UP TIMESTAMP");
//   if(!currentAudio) return;

//   // Load metadata
//   currentAudio.addEventListener('metadata',()=>{
//     const duration = currentAudio.duration;
//     console.log(duration)
//     updatDuration(duration)

//     const progressRange = document.getElementById("progress-range")
//     if(progressRange){
//       progressRange.max = Math.floor(duration)
//     }
//   })

//   currentAudio.addEventListener('timestamp',()=>{
//     const currTime = currentAudio.currentTime;
//     const duration = currentAudio.duration;

//     updateCurrentTime(currTime)
//     updatProgressBar(currTime,duration)
//   })

//   currentAudio.addEventListener('ended',()=>{
//     handleSongEnd();
//   })
// }