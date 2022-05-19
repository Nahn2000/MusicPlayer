// Khai báo biến
const wrapper = document.querySelector(".wrapper");
const musicImg = document.querySelector(".image-area img");
const musicName = document.querySelector(".song-details-name");
const musicArtist = document.querySelector(".song-details-artist");
const mainAudio = document.querySelector("#main-audio");
const buttonPause = document.querySelector(".controls-pause");
const buttonPrev = document.querySelector("#prev");
const buttonNext = document.querySelector("#next");
const progressArea = document.querySelector(".progress-area");
const progressBar = document.querySelector(".progress-area-bar");

isMusicPaused = true;
// Get index
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

// Load data
loadMusic = (index) => {
  musicName.innerHTML = allMusic[index - 1].name;
  musicArtist.innerHTML = allMusic[index - 1].artist;
  musicImg.src = `img/${allMusic[index - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[index - 1].src}.mp3`;
};
//Play Music
playMusic = () => {
  wrapper.classList.add("paused");
  buttonPause.querySelector("i").innerHTML = "pause";
  mainAudio.play();
};
//Pause Music
pauseMusic = () => {
  wrapper.classList.remove("paused");
  buttonPause.querySelector("i").innerHTML = "play_arrow";
  mainAudio.pause();
};
//Pre
preMusic = () => {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
};
//Next
nextMusic = () => {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
};
//Event Button
buttonPause.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
});
buttonPrev.addEventListener("click", () => {
  preMusic();
});
buttonNext.addEventListener("click", () => {
  nextMusic();
});
//Progess Bar
mainAudio.addEventListener("timeupdate", (event) => {
  const currentTime = event.target.currentTime;
  const duration = event.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});
//Update duration of song
let musicCurrentTime = document.querySelector(".current-time");
let musicDuration = document.querySelector(".max-duration");
mainAudio.addEventListener("loadeddata", () => {
  let mainAdDuration = mainAudio.duration;
  let totalMin = Math.floor(mainAdDuration / 60);
  let totalSec = Math.floor(mainAdDuration % 60);
  if (totalSec < 10) {
    totalSec = `0${totalSec}`;
  }
  musicDuration.innerHTML = `${totalMin}:${totalSec}`;
});
//Drag Progess Bar
progressArea.addEventListener("click", (event) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = event.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});
