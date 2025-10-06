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
let previousSongBtn = document.getElementById("previous-song");
let playedSongImgTag = document.getElementById("played-song-img");
let playedSongTitle = document.getElementById("played-song-name");
let playedSongArtist = document.getElementById("Played-song-artist");
let mainArtistImg = document.querySelectorAll(".main-artist-img");

let searchInput = document.getElementById("search-input");
let searchPage = document.querySelector(".search-result");
let preSearchHeading = document.querySelector(".pre-search-heading");
let postSearchHeading = document.querySelector(".post-search-heading");
let crossIcon = document.querySelector(".cross-icon");
let searchedSongResult = document.getElementById("searched-songs-result");

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
let loader2 = document.getElementById("loader02");

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
  // console.log("RENDERING GOES HERE--------------");
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
let isUserSeeking = false;

function setCurrentSong(songId) {
  currentSongId = songId;
  currentSongIndex = songData.findIndex((song) => song.id === songId);
  currentSongData = songData[currentSongIndex];

  console.log("current song set to ", currentSongData.title);
  // console.log("song index ", currentSongData.id);
}

function stopCurrentSong() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    isPlaying = false;
    // console.log("previous song stopped");
  }
}

function getCurrentPlaylistInfo() {
  console.log("Clicked next/prev btn, running getCurrentPlaylistInfo fun()");
  if (!currentSongData) return null;
  const currentPlaylist = currentSongData.playListId;
  // console.log("Current playlist: ",currentPlaylist)
  const playlistSongs = songData.filter(
    (song) => song.playListId === currentPlaylist
  );
  console.log(playlistSongs);
  const currentSongPosition = playlistSongs.findIndex(
    (song) => song.id === currentSongId
  );
  // console.log("CurrentsongPos: ",currentSongPosition)

  return {
    playlistSongs,
    currentSongPosition,
    totalSongs: playlistSongs.length,
    isFirstSong: currentSongPosition === 0,
    isLastSong: currentSongPosition === playlistSongs.length - 1,
  };
}

async function playSong(songId) {
  console.log("PLAY SONG GOES HERE--------------");
  console.log("Playing song ID:", songId);
  stopCurrentSong();
  setCurrentSong(songId);
  await playedSongImg(songId);

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
      // playedSongImg(songId);
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
      playedSongImgTag.src = "./assets/images/GroovoLogo03.png";
      console.log("Error fetching Imag:", error);
    }
    loader.classList.remove("hidden");
  }
}

// play pause logic
function togglePlayPause() {
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

  const playlistInfo = getCurrentPlaylistInfo();
  if (!playlistInfo) {
    console.log("no current song");
    return;
  }

  const { playlistSongs, currentSongPosition, isLastSong } = playlistInfo;

  console.log("Before calculation: ", { currentSongPosition, isLastSong });

  const nextPosition = isLastSong ? 0 : currentSongPosition + 1;
  console.log("next Position: ", nextPosition);
  console.log("After Calculation: ", nextPosition);

  const nextSong = playlistSongs[nextPosition];
  console.log("next song: ", nextSong.title);

  playSong(nextSong.id);
  playBtnId.classList.add("hidden");
}

function playPreviousSong() {
  console.log("Playing prev song");

  const playlistInfo = getCurrentPlaylistInfo();
  if (!playlistInfo) {
    console.log("No current Song or playList info");
    return;
  }

  const { playlistSongs, currentSongPosition, isFirstSong } = playlistInfo;
  const previousPosition = isFirstSong
    ? playlistSongs.length - 1
    : currentSongPosition - 1;

  const previousSong = playlistSongs[previousPosition];
  console.log("Previous song:", previousSong.title);
  playSong(previousSong.id);
}

previousSongBtn.addEventListener("click", () => {
  playPreviousSong();
});

// Getting the metadata of the song being played
function setupAudioEventListeners() {
  console.log("SETTING UP TIMESTAMP");
  if (!currentAudio) return;

  // Load metadata
  currentAudio.addEventListener("loadedmetadata", () => {
    const duration = currentAudio.duration;
    console.log("metadata loaded - duration:", duration);
    console.log("song Duration: ", formatTime(duration));

    const progressRange = document.getElementById("progress-range");
    if (progressRange) {
      progressRange.max = Math.floor(duration);
    }
    updatDuration(duration);
    updateCurrentTime(0);
  });

  currentAudio.addEventListener("timeupdate", () => {
    const currTime = currentAudio.currentTime;
    const duration = currentAudio.duration;

    updateCurrentTime(currTime);
    updatProgressBar(currTime, duration);
  });

  currentAudio.addEventListener("ended", () => {
    handleSongEnd();
  });

  currentAudio.addEventListener("play", () => {
    console.log("Audio Timer Started");
  });
  currentAudio.addEventListener("pause", () => {
    console.log("Audio Paused");
  });
}

// Function to format Time in MM:SS
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// update current time display && Duration
function updateCurrentTime(currTime) {
  const currentTimeElement = document.getElementById("current-time");
  // console.log(
  //   "Updating current time:",
  //   currTime,
  //   "Element found:",
  // !!currentTimeElement
  // );
  if (currentTimeElement) {
    currentTimeElement.textContent = formatTime(currTime);
  } else {
    console.error("currentTime element not found");
  }
}
function updatDuration(duration) {
  const durationElement = document.getElementById("duration");
  console.log(
    "Updating duration:",
    duration,
    "Element found:",
    !!durationElement
  );
  if (durationElement) {
    durationElement.textContent = formatTime(duration);
  } else {
    console.error("duration element not found");
  }
}

// update progress bar
function updatProgressBar(currTime, duration) {
  if (isUserSeeking) return;

  const progressRange = document.getElementById("progress-range");
  if (progressRange && duration > 0) {
    progressRange.value = currTime;
  }
}

// Handle user Clicking/dragging the progess bar
function setupProgressBarControls() {
  const progressRange = document.getElementById("progress-range");

  if (progressRange) {
    progressRange.addEventListener("mousedown", () => {
      isUserSeeking = true;
    });
    progressRange.addEventListener("mouseup", () => {
      if (currentAudio && isUserSeeking) {
        const seekTime = parseInt(progressRange.value);
        currentAudio.currentTime = seekTime;
        updateCurrentTime(seekTime);
        console.log(`Seeked to : ${formatTime(seekTime)}`);
      }
      isUserSeeking = false;
    });

    progressRange.addEventListener("input", () => {
      if (isUserSeeking) {
        const seekTime = parseInt(progressRange.value);
        updateCurrentTime(seekTime);
        console.log("Seeked Time: ", seekTime);
      }
    });

    progressRange.addEventListener("mouseleave", () => {
      if (isUserSeeking && currentAudio) {
        const seekTime = parseFloat(progressRange.value);
        currentAudio.currTime = seekTime;
      }
    });
  }
}

function handleSongEnd() {
  console.log("Song Ended");
  const progressRange = document.getElementById("progress-range");
  if (progressRange) {
    progressRange.value = 0;
  }
  updateCurrentTime(0);
  if (playBtn) playBtn.classList.remove("hidden");
  if (pauseBtnId) pauseBtnId.classList.add("hidden");

  isPlaying = false;
  isPaused = false;

  // PlayNext song
  playNextSong();
}

// Initialize progress bar controls when page loads
document.addEventListener("DOMContentLoaded", function () {
  setupProgressBarControls();
  console.log("Progress bar controls initialized");
});

console.log("Timer elements check:", {
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),
  progressRange: document.getElementById("progressRange"),
});

// setting search the result

searchInput.addEventListener("click", () => {
  searchPage.classList.remove("hidden");
  loader2.classList.remove("hidden");
  setTimeout(() => {
    loader2.classList.add("hidden");
    displayRandomSongInSearch();
  }, 1000);
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    preSearchHeading.classList.remove("hidden");
    postSearchHeading.classList.add("hidden");
  } else {
    postSearchHeading.classList.remove("hidden");
    preSearchHeading.classList.add("hidden");
  }

  // fetching songData
  const searchValue = searchInput.value;
  const results = songData.filter(
    (song) =>
      song.title?.toLowerCase().includes(searchValue) ||
      song.artistName?.toLowerCase().includes(searchValue)
  );
  console.log("Songs/Artist Found: ", results);

  searchedSongResult.innerHTML = " ";
  results.forEach((result) => {
    let songField = document.createElement("div");
    songField.className = "searched-song-field";

    songField.innerHTML = `
              <div>
                <h3 id="searched-song-name">${result.title}</h3>
                <p id="searched-song-artist">${result.artistName}</p>
              </div>
              <span id="searched-song-duration">${result.duration}</span>
    `;
    searchedSongResult.appendChild(songField);
    songField.addEventListener("click", () => {
      playSong(result.id);
      playBtnId.classList.add("hidden");
      pauseBtnId.classList.remove("hidden");
    });
  });
});

crossIcon.addEventListener("click", () => {
  searchPage.classList.add("hidden");
});

function displayRandomSongInSearch() {
  const randomSongs = songData.sort(() => 0.5 - Math.random()).slice(0, 10);
  console.log("RandomSongs:", randomSongs);

  searchedSongResult.innerHTML = " ";
  randomSongs.forEach((randomsong) => {
    let songField = document.createElement("div");
    songField.className = "searched-song-field";
    songField.innerHTML = `
              <div>
                <h3 id="searched-song-name">${randomsong.title}</h3>
                <p id="searched-song-artist">${randomsong.artistName}</p>
              </div>
              <span id="searched-song-duration">${randomsong.duration}</span>
    `;
    searchedSongResult.appendChild(songField);

    songField.addEventListener("click", () => {
      playSong(randomsong.id);
      playBtnId.classList.add("hidden");
      pauseBtnId.classList.remove("hidden");
    });
  });
}

mainArtistImg.forEach((artist,index) => {
  artist.addEventListener("click",(id)=>{
    console.log('artist id:',index,artist,id)
  })
});


createPlaylistBtn.addEventListener('click',()=>{
  console.log("Clicked playlist btn")
})