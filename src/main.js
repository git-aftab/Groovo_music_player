// Test if image loads
const img = new Image();
img.onload = () => console.log("Image loaded successfully");
img.onerror = () => console.log("Image failed to load");
img.src = "../assets/images/farhanKhan.jpeg";

// Main page Selectors
let createPlaylistBtn = document.getElementById("create-playlist")
let playListCards = document.querySelectorAll(".card")

// Banner page Selectors
let songTitleInBanner = document.getElementById("song-title-in-banner");
let artistNameBanner = document.getElementById("artist-name-banner");
let songDuration = document.getElementById("song-duration");
let songArtistImg = document.getElementById("song-artist-img");
let songOrPlaylistImgBanner = document.getElementById("songOrPlaylist-img");
let songListRow = document.getElementById("song-lists");

// Button Selectors
let backBtn = document.getElementById("back-button")

// Toggle Selectors
let songBannerPage = document.getElementById("song-banner-page")
let songMainPage = document.getElementById("main")



// Back button logic
backBtn.addEventListener("click",()=>{
    songBannerPage.classList.add("hidden")
    songMainPage.classList.remove("hidden")
    backBtn.classList.add("hidden")
})


playListCards.forEach((card,index)=>{
    card.addEventListener("click",()=> {
        console.log("Clicked playList Cards",index) 
        songBannerPage.classList.remove("hidden")
        songMainPage.classList.add("hidden")
        backBtn.classList.remove("hidden")

        
    })
})