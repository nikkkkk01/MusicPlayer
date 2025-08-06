console.log("Script loaded");

// Minimal songs array
const songs = [
    {
        id: 1,
        title: "Consume",
        artist: "Chase Atlantic",
        album: "Beauty in Death",
        albumArtUrl: "https://tse3.mm.bing.net/th?id=OIP.VwivM--7Xx_SmgsqXBLi8AAAAA&pid=Api&P=0&h=220",
        audioSrc: "audio/consume.mp3",
        videoBgSrc: "videos/consume.mp4",
        lyrics: [
            { time: 0.8, text: "She said, Careful, or you'll lose it" },
            { time: 4, text: "But, girl, I'm only human," },
            { time: 7, text: "And I know there's a blade where your heart is" },
            { time: 10, text: "And you know how to use it" },
            { time: 13, text: "And you can take my flesh if you want girl" },
            { time: 16, text: "But, baby, don't abuse it (Calm down)" },
            { time: 19, text: "These voices in my head screaming, Run now (Don't run)" },
            { time: 22, text: "I'm praying that they're human" },
            { time: 25, text: "Please understand that I'm trying my hardest" },
            { time: 28, text: "My head's a mess, but I'm trying regardless" },
            { time: 31, text: "Anxiety is one hell of a problem" },
            { time: 34, text: "She's latching onto me, I can't resolve it" },
            { time: 37, text: "It's not right, it's not fair, it's not fair" },
            { time: 41.5, text: "It's not fair, it's not fair, it's not fair" },
            { time: 47, text: "Oh, no, no, no, ooh-ooh" },
        ]
    },
    {
        id: 2,
        title: "Let Down",
        artist: "Radiohead",
        album: "OK Computer",
        albumArtUrl: "https://images.genius.com/ea1fda114f5091bce67f87cf8437b647.1000x1000x1.png",
        audioSrc: "audio/letdown.mp3",
        videoBgSrc: "videos/letdown.mp4",
        lyrics: [
            { time: 0.2  ,  text: "Floor collapsing Floating" },
            { time: 5,  text: "bouncing back and " },
            { time: 7, text: "One day, I am gonna grow wings" },
            { time: 14.2, text: "A chemical reaction" },
            { time: 17.9, text: "Hysterical and useless" },
            { time: 23, text: "Hysterical and" },
            { time: 26, text: "Let down and hanging around" },
            { time: 33, text: "Crushed like a bug in the ground" },
            { time: 40, text: "Let down and hanging around" }
        ]
    }
];

let currentSongIndex = 0;
let isPlaying = false;

// DOM Elements
const songListElement = document.getElementById('songList');
const playerPage = document.getElementById('playerPage');
const homePage = document.getElementById('homePage');
const albumArtPlayer = document.getElementById('albumArt');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const lyricsContainer = document.getElementById('lyricsContainer');
const audioPlayer = document.getElementById('audioPlayer');
const backgroundVideo = document.getElementById('backgroundVideo');
const playerPlayPauseBtn = document.getElementById('playerPlayPauseBtn');
const playerPrevBtn = document.getElementById('playerPrevBtn');
const playerNextBtn = document.getElementById('playerNextBtn');
const playerCurrentTime = document.getElementById('playerCurrentTime');
const playerTotalDuration = document.getElementById('playerTotalDuration');
const playerProgressBar = document.getElementById('playerProgressBar');
const playerProgressBarContainer = document.getElementById('playerProgressBarContainer');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const backgroundVideoContainer = document.querySelector('.video-background-container');
const playerSpeedSlider = document.getElementById('playerSpeedSlider');
const currentSpeedDisplay = document.getElementById('currentSpeedDisplay');
const playerVolumeSlider = document.getElementById('playerVolumeSlider');
const playerRepeatBtn = document.getElementById('playerRepeatBtn');
const playerShuffleBtn = document.getElementById('playerShuffleBtn');

let isShuffle = false;
let repeatMode = 0; // 0: off, 1: repeat one

// Render song list
function renderSongList() {
    songListElement.innerHTML = '';
    songs.forEach((song, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${song.albumArtUrl}" alt="${song.title}" class="song-art-list" style="width:50px;height:50px;border-radius:8px;margin-right:1rem;">
            <div class="song-info-list">
                <h3 style="margin:0 0 0.25rem 0;font-size:1.1rem;color:#fff;">${song.title}</h3>
                <p style="margin:0;font-size:0.85rem;color:#b3b3b3;">${song.artist}</p>
            </div>
        `;
        // Show video background on hover (no music)
        li.addEventListener('mouseenter', () => {
            backgroundVideo.src = song.videoBgSrc;
            backgroundVideoContainer.classList.add('active');
            backgroundVideo.load();
            backgroundVideo.play().catch(() => {});
        });
        li.addEventListener('mouseleave', () => {
            backgroundVideo.pause();
            backgroundVideo.src = "";
            backgroundVideoContainer.classList.remove('active');
        });
        li.addEventListener('click', () => {
            currentSongIndex = idx;
            showPlayerPage();
            loadSong(songs[currentSongIndex]);
            playTrack();
        });
        songListElement.appendChild(li);
    });
}

// Show player page and video background
function showPlayerPage() {
    homePage.classList.remove('active');
    playerPage.classList.add('active');
    backgroundVideoContainer.classList.add('active');
}

// Hide player page and video background
function showHomePage() {
    playerPage.classList.remove('active');
    homePage.classList.add('active');
    pauseTrack();
    backgroundVideo.pause();
    backgroundVideo.src = "";
    backgroundVideoContainer.classList.remove('active');
}

// Load song into player and set video background
function loadSong(song) {
    albumArtPlayer.src = song.albumArtUrl;
    playerTrackTitle.textContent = song.title;
    playerTrackArtist.textContent = song.artist;
    audioPlayer.src = song.audioSrc;
    
    // Update video background
    if (song.videoBgSrc) {
        backgroundVideo.src = song.videoBgSrc;
        backgroundVideo.load();
        backgroundVideo.play().catch(e => console.log("Video autoplay prevented:", e));
    }
    
    renderLyrics(song.lyrics);
    audioPlayer.onloadedmetadata = () => {
        playerTotalDuration.textContent = formatTime(audioPlayer.duration);
    };
    playerCurrentTime.textContent = "0:00";
    playerProgressBar.style.width = "0%";
}

// Render lyrics
function renderLyrics(lyrics) {
    lyricsContainer.innerHTML = '';
    if (!lyrics || lyrics.length === 0) {
        lyricsContainer.innerHTML = "<p>Lyrics not available.</p>";
        return;
    }
    lyrics.forEach(line => {
        const span = document.createElement('span');
        span.textContent = line.text;
        span.setAttribute('data-time', line.time);
        span.classList.add('lyric-line');
        lyricsContainer.appendChild(span);
    });
}

// Play/pause logic
function playTrack() {
    isPlaying = true;
    audioPlayer.play();
    backgroundVideo.play();
    updatePlayPauseIcon();
}
function pauseTrack() {
    isPlaying = false;
    audioPlayer.pause();
    backgroundVideo.pause();
    updatePlayPauseIcon();
}
function updatePlayPauseIcon() {
    playerPlayPauseBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
}

// Progress bar and lyrics sync
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playerProgressBar.style.width = percent + "%";
        playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);

        // Highlight lyrics
        const currentTime = audioPlayer.currentTime;
        const lyricLines = lyricsContainer.querySelectorAll('.lyric-line');
        let highlightedLine = null;
        lyricLines.forEach((line, i) => {
            const lineTime = parseFloat(line.getAttribute('data-time'));
            let nextLineTime = i + 1 < lyricLines.length
                ? parseFloat(lyricLines[i + 1].getAttribute('data-time'))
                : Infinity;
            if (currentTime >= lineTime && currentTime < nextLineTime) {
                line.classList.add('highlight');
                highlightedLine = line;
            } else {
                line.classList.remove('highlight');
            }
        });
        if (highlightedLine) {
            highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

// Progress bar seek
playerProgressBarContainer.addEventListener('click', (e) => {
    if (!audioPlayer.duration) return;
    const width = playerProgressBarContainer.clientWidth;
    const clickX = e.offsetX;
    audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

// Player controls
playerPlayPauseBtn.addEventListener('click', () => {
    isPlaying ? pauseTrack() : playTrack();
});
playerPrevBtn.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = songs.length - 1;  // Loop to last song
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
});
playerNextBtn.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;  // Loop back to first song
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
});
backToHomeBtn.addEventListener('click', showHomePage);

// Set initial speed display and value
document.addEventListener('DOMContentLoaded', () => {
    renderSongList();
    if (playerSpeedSlider && audioPlayer) {
        audioPlayer.playbackRate = parseFloat(playerSpeedSlider.value);
        currentSpeedDisplay.textContent = playerSpeedSlider.value + "x";
    }
    if (playerVolumeSlider && audioPlayer) {
        audioPlayer.volume = parseFloat(playerVolumeSlider.value);
    }
});

// Playback speed control
if (playerSpeedSlider && audioPlayer) {
    playerSpeedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        audioPlayer.playbackRate = speed;
        currentSpeedDisplay.textContent = speed + "x";
    });
}

// Volume control
if (playerVolumeSlider && audioPlayer) {
    playerVolumeSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        audioPlayer.volume = vol;
    });
}

// Shuffle button logic
if (playerShuffleBtn) {
    playerShuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        playerShuffleBtn.classList.toggle('active-feature', isShuffle);
    });
}

// Repeat button logic
if (playerRepeatBtn) {
    playerRepeatBtn.addEventListener('click', () => {
        repeatMode = repeatMode === 0 ? 1 : 0;
        updateRepeatButtonUI();
    });
}

function updateRepeatButtonUI() {
    playerRepeatBtn.classList.remove('active-feature');
    audioPlayer.loop = false;
    playerRepeatBtn.querySelector('i').className = 'fas fa-repeat';
    playerRepeatBtn.removeAttribute('data-repeat-one');
    if (repeatMode === 1) {
        playerRepeatBtn.classList.add('active-feature');
        playerRepeatBtn.setAttribute('data-repeat-one', '1');
        audioPlayer.loop = true;
    }
}

// Add this CSS to your style.css for the "repeat one" badge:
/*
#playerRepeatBtn[data-repeat-one="1"] i::after {
    content: "1";
    font-size: 0.6em;
    position: absolute;
    top: 0.45em;
    right: 0.5em;
    color: #fff;
    background: #380056;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
}
#playerRepeatBtn {
    position: relative;
}
*/

// Next/Prev logic with shuffle/repeat
playerNextBtn.addEventListener('click', () => {
    // If repeat is active (repeatMode === 1), stay on current song
    if (repeatMode === 1) {
        audioPlayer.currentTime = 0;
        playTrack();
        return;
    }
    
    // Otherwise go to next song
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playTrack();
});

playerPrevBtn.addEventListener('click', () => {
    // If repeat is active, restart current song
    if (repeatMode === 1) {
        audioPlayer.currentTime = 0;
        playTrack();
        return;
    }
    
    // Otherwise go to previous song
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playTrack();
});

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    const nextSong = songs[currentSongIndex];
    loadSong(nextSong);
    playTrack();
    updateUI();
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[currentSongIndex];
    loadSong(prevSong);
    playTrack();
    updateUI();
}

function updateUI() {
    // Update player info
    playerTrackTitle.textContent = songs[currentSongIndex].title;
    playerTrackArtist.textContent = songs[currentSongIndex].artist;
    albumArtPlayer.src = songs[currentSongIndex].albumArtUrl;
    
    // Update video background
    backgroundVideo.src = songs[currentSongIndex].videoBgSrc;
    backgroundVideo.load();
    backgroundVideo.play().catch(e => console.log("Video autoplay prevented:", e));
}

// Update button event listeners
playerNextBtn.addEventListener('click', nextSong);
playerPrevBtn.addEventListener('click', previousSong);

// Also handle auto-play next song when current song ends
audioPlayer.addEventListener('ended', () => {
    if (!audioPlayer.loop) {  // Only go to next if not in repeat-one mode
        nextSong();
    }
});

// Initialize repeat button UI on load
document.addEventListener('DOMContentLoaded', () => {
    renderSongList();
    updateRepeatButtonUI();
});

// Utility
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderSongList();
});