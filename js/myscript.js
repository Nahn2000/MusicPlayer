// Khai báo biến
const wrapper = document.querySelector(".wrapper");
musicImg = wrapper.querySelector(".image-area img");
musicName = wrapper.querySelector(".song-details .song-details-name");
musicArtist = wrapper.querySelector(".song-details .song-details-artist");
buttonPause = wrapper.querySelector(".controls .controls-pause");
buttonPrev = wrapper.querySelector("#prev");
buttonNext = wrapper.querySelector("#next");
mainAudio = wrapper.querySelector("#main-audio");
progressArea = wrapper.querySelector(".progress-area");
progressBar = wrapper.querySelector(".progress-area-bar");
musicList = wrapper.querySelector(".music-list");
moreMusic = wrapper.querySelector("#more-music");
closeMoreMusic = musicList.querySelector("#close");
// --------------
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

isMusicPaused = true;
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

loadMusic = (index) => {
  musicName.innerHTML = allMusic[index - 1].name;
  musicArtist.innerHTML = allMusic[index - 1].artist;
  musicImg.src = `img/${allMusic[index - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[index - 1].src}.mp3`;
};
playMusic = () => {
  wrapper.classList.add("paused");
  buttonPause.querySelector("i").innerHTML = "pause";
  mainAudio.play();
};
pauseMusic = () => {
  wrapper.classList.remove("paused");
  buttonPause.querySelector("i").innerHTML = "play_arrow";
  mainAudio.pause();
};
prevMusic = () => {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};
nextMusic = () => {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};
buttonPause.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});
buttonPrev.addEventListener("click", () => {
  prevMusic();
});
buttonNext.addEventListener("click", () => {
  nextMusic();
});
mainAudio.addEventListener("timeupdate", (event) => {
  const currentTime = event.target.currentTime;
  const duration = event.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerHTML = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  console.log(clickedOffsetX);
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});
const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});
moreMusic.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closeMoreMusic.addEventListener("click", () => {
  moreMusic.click();
});
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
