// Main page Selectors --------------------
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
let playlistTempMsg = document.querySelector(".playlist-temp-msg");

// Playlist DOM ---------------------------
let createPlaylistBtn = document.getElementById("create-playlist-btn");
let playlistNameCardBg = document.getElementById("playlist-name-card-bg");
let crossIcon02 = document.querySelector(".cross-icon02");
let searchInput = document.getElementById("search-input");
let searchPage = document.querySelector(".search-result");
let searchHeading = document.querySelector(".search-heading");
let preSearchHeading = document.querySelector(".pre-search-heading");
let postSearchHeading = document.querySelector(".post-search-heading");
let crossIcon = document.querySelectorAll(".cross-icon");
let searchedSongResult = document.getElementById("searched-songs-result");
let playlistInput = document.getElementById("playlistInput");
let savePlaylistBtn = document.getElementById("save-playlist-btn");
let playlistLists = document.getElementById("playlist-list");
let artistDetails = document.querySelectorAll(".artist-card");

let openedPlaylist = document.querySelector(".opened-playlist");
let openedPlaylistTempMsg = document.getElementById("opened-play-temp-msg");
let crossIcon03 = document.querySelector(".cross-icon03");
let addSongsinPlaylistBtn = document.querySelectorAll(
  ".opened-playlist-addSong-btn"
);
let openedPlaylistHeader = document.getElementById("opened-playlist-header");
let addSongsMainBtn = document.getElementById("add-songs-main-btn");
let emptyPlaylistMsg = document.getElementById("empty-playlist-msg");
let playlistSongsList = document.querySelector(".playlist-songs-list");

// Banner page Selectors------------------
let songTitleInBanner = document.getElementById("song-title-in-banner");
let artistNameBanner = document.getElementById("artist-name-banner");
let songDuration = document.getElementById("song-duration");
let songArtistImg = document.getElementById("song-artist-img");
let songOrPlaylistImgBanner = document.getElementById("songOrPlaylist-img");
let songListContainer = document.getElementById("song-lists");
let staticPlaylistMeta = document.getElementById("static-playlist-meta");

// Button Selectors--------------------------
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

// playlist.json
const playlistRes = await fetch("data/playlist.json");
const playLists = await playlistRes.json();
console.log(playLists);

// Artist.json
const artistsPlaylist = await fetch("data/artists.json");
const artistsPlaylistRes = await artistsPlaylist.json();
console.log(artistsPlaylistRes);
// Song.json
const res = await fetch("data/songs.json");
const songData = await res.json();
console.log(songData);

async function loadBanner(playListId, mode) {
  // console.log(mode)
  if (mode === "artistMode") {
    const playlist = artistsPlaylistRes.find(
      (pl) => pl.playListId === playListId
    );
    console.log(playlist);

    if (playlist) {
      songOrPlaylistImgBanner.src = playlist.image;
      songTitleInBanner.textContent = playlist.title;
    }
    return;
  }

  // Find the playlist by Id
  const playList = playLists.find((pl) => pl.id === playListId);
  console.log(playList);
  console.log(playListId);

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

async function renderSongs(playListID, mode, index) {
  console.log(mode, playListID);
  if (mode === "artistMode") {
    console.log("inside artist mode");
    const playlistSong = songData.filter((song) => song.artistId === index);
    console.log(playlistSong);

    songListContainer.innerHTML = "";
    playlistSong.forEach((song,index) => {
      // console.log(song)
      let songRow = document.createElement("div");
      songRow.className = "songList-row";

      songRow.innerHTML = `
            <div class="cell">${index+1}</div>
            <div class="cell">${song.title}</div>
            <div class="cell">${song.artistName}</div>
            <div class="cell">${song.duration}</div>
            `;

      songListContainer.appendChild(songRow);
      // Play song Event trigger
      songRow.addEventListener("click", () => {
        playSong(song.id);
        playBtnId.classList.add("hidden");
        pauseBtnId.classList.remove("hidden");
      });
    });
    return;
  }
  const playListSong = songData.filter(
    (song) => song.playListId === playListID
  );

  songListContainer.innerHTML = "";

  playListSong.forEach((song,index) => {
    let songRow = document.createElement("div");
    songRow.className = "songList-row";
    songRow.innerHTML = `
            <div class="cell">${index+1}</div>
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
// playlist
let SearchedMode = "play";
let targetPlaylist = null;
let staticPlaylistViewMode = "BuiltinPlaylist";

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
    const currentVolume = volumeSlider.value / 100;
    currentAudio.volume = currentVolume;
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
setupProgressBarControls();
console.log("Progress bar controls initialized");

console.log("Timer elements check:", {
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),
  progressRange: document.getElementById("progressRange"),
});

// setting search the result
searchInput.addEventListener("click", () => {
  if (SearchedMode === "addToPlaylist") {
    searchInput.placeholder = "Search Songs for Playlist";
    searchPage.classList.remove("hidden");
    loader2.classList.remove("hidden");
    setTimeout(() => {
      loader2.classList.add("hidden");
      // displayRandomSongInSearch();
    }, 1);
  } else if (SearchedMode === "play") {
    searchPage.classList.remove("hidden");
    loader2.classList.remove("hidden");
    setTimeout(() => {
      loader2.classList.add("hidden");
      displayRandomSongInSearch();
    }, 1000);
  }
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
      if (SearchedMode === "play") {
        playSong(result.id);
      }
      playBtnId.classList.add("hidden");
      pauseBtnId.classList.remove("hidden");

      if (SearchedMode === "addToPlaylist") {
        searchInput.placeholder = "Search Songs for Playlist";

        const success = addSongsToPlaylist(targetPlaylist, result.id);
        console.log("563", success);
        songField.innerHTML = `
              <div>
                <h3 id="searched-song-name">${result.title}</h3>
                <p id="searched-song-artist">${result.artistName}</p>
              </div>
              <span id="add-searched-song"><i class="fa-solid fa-circle-plus"></i></span>
          `;
        // if (success) {
        //   alert(`Added "${result.title}" to ${targetPlaylist}`);
        // } else {
        //   alert(`song ALREADY in ${targetPlaylist}`);
        // }
      }
    });
  });
});

crossIcon.forEach((btn) => {
  btn.addEventListener("click", () => {
    searchPage.classList.add("hidden");
  });
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

createPlaylistBtn.addEventListener("click", () => {
  console.log("Clicked playlist btn");
  playlistNameCardBg.classList.remove("hidden");
});
crossIcon02.addEventListener("click", () => {
  playlistNameCardBg.classList.add("hidden");
});

function createPlaylistElement(playlistName) {
  let createdPlaylist = document.createElement("div");
  createdPlaylist.className = "playlist-folder";

  createdPlaylist.innerHTML = `
    <span class='playlist-folder-name'>${playlistName}</span>
    <div class="playlist-menu-wrapper">
      <i class="fa-solid fa-ellipsis-vertical playlist-menu-icon"></i>
      <div class="playlist-dropdown-menu hidden">
        <div class="dropdown-item delete-playlist">Delete</div>
      </div>
    </div>
  `;

  createdPlaylist.setAttribute("data-playlist", playlistName);

  // Main click handler - open playlist
  createdPlaylist.addEventListener("click", (e) => {
    // Don't open playlist if clicking menu
    if (e.target.closest(".playlist-menu-icon")) return;

    console.log("clicked the playlist:", playlistName);

    // Remove active from all
    document.querySelectorAll(".playlist-folder").forEach((p) => {
      p.classList.remove("active-custom-playlist");
    });

    // Add active to current
    createdPlaylist.classList.add("active-custom-playlist");
    songMainPage.classList.add("hidden");
    openedPlaylist.classList.remove("hidden");
    targetPlaylist = playlistName;
    openedPlaylistHeader.textContent = playlistName + "🎶";

    const playlistSongs = getPlaylistSongs(playlistName);
    console.log("songs in playlists: ", playlistSongs);

    if (playlistSongs.length === 0) {
      playlistSongsList.innerHTML = "";
      addSongsMainBtn.classList.remove("hidden");
      emptyPlaylistMsg.classList.remove("hidden");
    } else {
      addSongsMainBtn.classList.add("hidden");
      emptyPlaylistMsg.classList.add("hidden");
      displayPlaylistSongs(playlistSongs, playlistName);
    }
  });

  // Menu icon and delete functionality
  let PlaylistMenuIcon = createdPlaylist.querySelector(".playlist-menu-icon");
  let dropDownMenu = createdPlaylist.querySelector(".playlist-dropdown-menu");
  let deleteItem = createdPlaylist.querySelector(".delete-playlist");

  PlaylistMenuIcon.addEventListener("click", (e) => {
    console.log("🔴 MENU ICON CLICKED");
    e.stopPropagation();

    // Close all other dropdowns
    document.querySelectorAll(".playlist-dropdown-menu").forEach((menu) => {
      if (menu !== dropDownMenu) {
        menu.classList.add("hidden");
      }
    });

    // Toggle current dropdown
    dropDownMenu.classList.toggle("hidden");
  });

  deleteItem.addEventListener("click", (e) => {
    e.stopPropagation();
    dropDownMenu.classList.add("hidden");
    deleteCompPlaylist(playlistName);
  });

  return createdPlaylist;
}

savePlaylistBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let playlistName = playlistInput.value.trim();

  if (!playlistName) {
    alert("please enter a playlist name!");
    return;
  }
  if (playlistData.playlists[playlistName]) {
    alert("playlist already exists");
    return;
  }

  console.log("Playlist Created: ", playlistName);
  playlistTempMsg.classList.add("hidden");

  // Use the helper function
  let createdPlaylist = createPlaylistElement(playlistName);
  playlistLists.appendChild(createdPlaylist);

  playlistNameCardBg.classList.add("hidden");
  playlistInput.value = "";

  createPlayist(playlistName);
});

crossIcon03.addEventListener("click", () => {
  openedPlaylist.classList.add("hidden");
  songMainPage.classList.remove("hidden");
});

addSongsinPlaylistBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Add songs btn clicked");
    SearchedMode = "addToPlaylist";
    console.log(SearchedMode, targetPlaylist);
    searchPage.classList.remove("hidden");
    // searchHeading.innerHTML=" "
    searchHeading.innerHTML = `
        <div class="pre-search-heading">
              <h1>Add Songs - ${targetPlaylist}</h1>
            </div>
            <div class="cross-icon"><i class="fa-solid fa-xmark"></i></div>
    `;
    const newCrossIcon = searchHeading.querySelector(".cross-icon");
    newCrossIcon.addEventListener("click", () => {
      SearchedMode = "play";
      targetPlaylist = null;
      searchPage.classList.add("hidden");
      SearchedMode = "play";
      searchInput.placeholder = "Search Songs";
    });
  });
});

//  LoadPlaylist if exists
function loadPlaylist() {
  const stored = localStorage.getItem("userPlaylists");
  return stored ? JSON.parse(stored) : { playlists: {} };
}

let playlistData = loadPlaylist();
console.log("LS playlist ", playlistData.playlists);

function savePlaylists() {
  localStorage.setItem("userPlaylists", JSON.stringify(playlistData));
}

function createPlayist(playlistName) {
  if (!playlistData.playlists[playlistName]) {
    playlistData.playlists[playlistName] = {
      name: playlistName,
      songs: [],
      createdAt: new Date().toISOString(),
    };
    savePlaylists();
  }
}

function addSongsToPlaylist(playlistName, songId) {
  if (playlistData.playlists[playlistName]) {
    if (!playlistData.playlists[playlistName].songs.includes(songId)) {
      playlistData.playlists[playlistName].songs.push(songId);
      savePlaylists();

      // Check if we're currently viewing this playlist
      if (
        targetPlaylist === playlistName &&
        !openedPlaylist.classList.contains("hidden")
      ) {
        addSingleSongToPlaylist(songId, playlistName);
      }

      console.log(`Added song ${songId} to ${playlistName}`);
      return true;
    } else {
      console.log("Song Already in Playlist");
      return false;
    }
  }
  return false;
}

function addSingleSongToPlaylist(songId, playlistName) {
  const song = songData.find((s) => s.id === songId);
  if (!song) return;

  // Get current number of songs for index
  const currentSongCount = playlistSongsList.children.length;
  const index = currentSongCount; // Next index

  let songRow = document.createElement("div");
  songRow.className = "playlist-song-row";
  songRow.innerHTML = `
    <span>${index + 1}</span>
    <h4 id="playlist-song-title">${song.title}</h4>
    <p id="playlist-song-artistName">-by ${song.artistName}</p>
    <p id="playlist-song-duration">${song.duration}</p>
    <p class="playlist-song-del-btn"><i class="fa-solid fa-trash"></i></p>
  `;

  songRow.addEventListener("click", () => {
    playSong(song.id);
    playBtnId.classList.add("hidden");
    pauseBtnId.classList.remove("hidden");
  });

  // Delete button
  let playlistDelBtn = songRow.querySelector(".playlist-song-del-btn");
  playlistDelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Delete ${song.title} from ${playlistName}..?`)) {
      delSongFromPlaylist(playlistName, song.id);
    }
  });

  playlistSongsList.appendChild(songRow);

  // Hide empty state if it was showing
  addSongsMainBtn.classList.add("hidden");
  emptyPlaylistMsg.classList.add("hidden");
}

function getPlaylistSongs(playlistName) {
  if (!playlistData.playlists[playlistName]) return [];

  const songIds = playlistData.playlists[playlistName].songs;

  return songData.filter((song) => songIds.includes(song.id));
}

function displayPlaylistSongs(songs, playlistName) {
  playlistSongsList.innerHTML = "";
  songs.forEach((song, index) => {
    let songRow = document.createElement("div");
    songRow.className = "playlist-song-row";
    songRow.innerHTML = `
    <span>${index + 1}</span>
    <h4 id= "playlist-song-title">${song.title}</h4>
    <p id = "playlist-song-artistName">-by ${song.artistName}</p>
    <p id = "playlist-song-duration"> ${song.duration}</p>
    <p class = "playlist-song-del-btn"><i class="fa-solid fa-trash"></i></p>
    `;
    songRow.addEventListener("click", () => {
      playSong(song.id);
      playBtnId.classList.add("hidden");
      pauseBtnId.classList.remove("hidden");
    });

    playlistSongsList.appendChild(songRow);

    // delete plyalist songs
    let playlistDelBtn = songRow.querySelector(".playlist-song-del-btn");
    playlistDelBtn.addEventListener("click", (e) => {
      console.log("clicked Playlist del btn at index", index);
      e.stopPropagation();
      if (confirm(`Delete ${song.title} from ${playlistName}..?`)) {
        delSongFromPlaylist(playlistName, song.id);
      }
    });
  });
}

function delSongFromPlaylist(playlistName, songId) {
  console.log("hey deleting the song at index", songId, "from", playlistName);

  if (!playlistData.playlists[playlistName]) {
    console.error("playlist Not Found:", playlistName);
    alert("playlist Not Found:", playlistName);
    return;
  }

  const songIndex = playlistData.playlists[playlistName].songs.indexOf(songId);

  if (songIndex === -1) {
    console.error("Song not found in playlist");
    alert("Song not found in playlist");
    return;
  }

  playlistData.playlists[playlistName].songs.splice(songIndex, 1);

  // save to LS
  savePlaylists();

  console.log(`Deleted the song ${songId} from ${playlistName}`);

  const UpdatedSongs = getPlaylistSongs(playlistName);

  if (UpdatedSongs.length === 0) {
    playlistSongsList.innerHTML = "";
    addSongsMainBtn.classList.remove("hidden");
    emptyPlaylistMsg.classList.remove("hidden");
  } else {
    displayPlaylistSongs(UpdatedSongs, playlistName);
  }
}

function loadSavedPlaylist() {
  const playlists = Object.keys(playlistData.playlists);

  playlists.forEach((playlistName) => {
    let createdPlaylist = createPlaylistElement(playlistName);
    playlistLists.appendChild(createdPlaylist);
  });

  playlistTempMsg.classList.add("hidden");
}

// Close dropdown when clicking
document.addEventListener("click", (e) => {
  if (!e.target.closest(".playlist-menu-wrapper")) {
    document.querySelectorAll(".playlist-dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});

// Close playlist view
crossIcon03.addEventListener("click", () => {
  document.querySelectorAll(".playlist-folder").forEach((p) => {
    p.classList.remove("active-custom-playlist");
  });
  openedPlaylist.classList.add("hidden");
  songMainPage.classList.remove("hidden");
});

// Load saved playlists on page load
loadSavedPlaylist();

function deleteCompPlaylist(playlistName) {
  console.log("deleting playlist=>", playlistName);
  console.log(playlistData.playlists[playlistName]);

  if (!confirm(`Delete Entire Playlist: ${playlistName}`)) return;

  // delete the playlist
  delete playlistData.playlists[playlistName];
  savePlaylists();

  if (targetPlaylist === playlistName) {
    openedPlaylist.classList.add("hidden");
    songMainPage.classList.remove("hidden");
  }

  const playlistElement = document.querySelector(
    `[data-playlist = "${playlistName}"]`
  );
  if (playlistElement) {
    playlistElement.remove();
  }

  console.log(`Playlist "${playlistName}" deleted successfully`);
}

artistDetails.forEach((artistCard, index) => {
  artistCard.addEventListener("click", () => {
    const playlistId = parseInt(artistCard.dataset.id);
    // console.log(playlistId);
    staticPlaylistViewMode = "artistMode";
    songBannerPage.classList.remove("hidden");
    songMainPage.classList.add("hidden");
    backBtn.classList.remove("hidden");
    if (staticPlaylistViewMode === "artistMode") {
      loadBanner(playlistId, staticPlaylistViewMode);
      renderSongs(playlistId, staticPlaylistViewMode, index + 1);
    }
    console.log("artist id:", index + 1, artistCard, staticPlaylistViewMode);
  });
});

const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");

if (currentAudio) {
  currentAudio.volume = 0.6;
}

volumeSlider.addEventListener("input", (e) => {
  const volume = e.target.value / 100;

  if (currentAudio) {
    currentAudio.volume = volume;
  }

  updateVolumeIcon(volume);

  console.log("volume set to:", volume);
});

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else if (volume < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}

let previousVolume = 0.7;

volumeIcon.addEventListener("click", () => {
  if (currentAudio) {
    if (currentAudio.volume > 0) {
      // Mute
      previousVolume = currentAudio.volume;
      currentAudio.volume = 0;
      volumeSlider.value = 0;
      updateVolumeIcon(0);
    } else {
      // Unmute
      currentAudio.volume = previousVolume;
      volumeSlider.value = previousVolume * 100;
      updateVolumeIcon(previousVolume);
    }
  }
});
