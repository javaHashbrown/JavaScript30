// get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const fullscreen = player.querySelector('.fullscreen');

//const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

// build functions
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  //console.log(method);
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '▌▌';
  toggle.textContent = icon;
}

function skip() {
  //console.log(this.dataset);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  //console.log(this.value);
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  console.log(e);
}

function toggleFullscreen() {
  //console.log('fullscreen');
  if (isFullScreen()) {
    console.log('in fullscreen mode');
    if (document.exitFullscreen) {
      console.log('exit fullscreen default');
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      console.log('exit fullscreen webkit');
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    console.log('not in fullscreen mode');
    if (video.requestFullscreen) {
      player.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    }
  }
}

function isFullScreen() {
  return !!(
    document.fullScreen ||
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  );
}

// event listeners
video.controls = false;
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('dblclick', toggleFullscreen);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

//progress.addEventListener('mouseout',()=>mousedown = false);
fullscreen.addEventListener('click', toggleFullscreen);
