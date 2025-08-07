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
            { time: 0.2, text: "Floor collapsing Floating" },
            { time: 5, text: "bouncing back and " },
            { time: 7, text: "One day, I am gonna grow wings" },
            { time: 14.2, text: "A chemical reaction" },
            { time: 17.9, text: "Hysterical and useless" },
            { time: 23, text: "Hysterical and" },
            { time: 26, text: "Let down and hanging around" },
            { time: 33, text: "Crushed like a bug in the ground" },
            { time: 40, text: "Let down and hanging around" }
        ]
    },
    {
        id: 3,
        title: "Cherry Waves",
        artist: "Deftones",
        album: "Sunday Night Wrist",
        albumArtUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music/14/fb/a8/mzi.fyjrjjzn.jpg/600x600bf-60.jpg",
        audioSrc: "audio/cherrywaves.mp3",
        videoBgSrc: "videos/cherrywaves.mp4",
        lyrics: [
            { time: 0.8, text: "The waves" },
            { time: 4, text: "SUCKKKKKKKKKKKKKKKKKKK" },
            { time: 9, text: "You in" },
            { time: 11, text: "Then you drown" },
            { time: 15, text: "If like" },
            { time: 16, text: "You, oh, oh ,ohh" },
            { time: 19, text: "Should sink, down beneath" },
            { time: 26, text: "I'll swim down" },
            { time: 32, text: "With you" },
            { time: 35, text: "Is that what you want" },
            { time: 40, text: "You" },
            { time: 43, text: "Is that what you want..." },
        ]
    }
];

let currentSongIndex = 0;
let isPlaying = false;
let videoIsReady = false;
let videoPlayAttempts = 0;

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

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Set up video container with correct styles
function initializeVideoContainer() {
    backgroundVideoContainer.style.position = 'fixed';
    backgroundVideoContainer.style.top = '0';
    backgroundVideoContainer.style.left = '0';
    backgroundVideoContainer.style.width = '100%';
    backgroundVideoContainer.style.height = '100%';
    backgroundVideoContainer.style.zIndex = '0';
    
    backgroundVideo.style.position = 'absolute';
    backgroundVideo.style.width = '100%';
    backgroundVideo.style.height = '100%';
    backgroundVideo.style.objectFit = 'cover';
}

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
        
        // Preview on hover (mobile or desktop)
        li.addEventListener('mouseenter', () => {
            backgroundVideo.src = song.videoBgSrc;
            backgroundVideoContainer.classList.add('active');
            backgroundVideo.load();
            backgroundVideo.muted = true;
            backgroundVideo.play().catch(() => {});
        });
        
        li.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                backgroundVideo.pause();
                backgroundVideo.src = "";
                backgroundVideoContainer.classList.remove('active');
            }
        });

        // Track selection handling - prevent double clicks
        let activated = false;
        function selectSong(e, isTouchEvent) {
            if (activated) return;
            activated = true;
            e.preventDefault();
            
            // Store selected song index
            currentSongIndex = idx;
            
            // Switch to player page first
            showPlayerPage();
            
            // Then prepare media (with different logic for mobile vs desktop)
            prepareAndPlayMedia(isTouchEvent);
            
            // Reset activation flag after a delay
            setTimeout(() => activated = false, 800);
        }
        
        // Add both event types with correct handling
        li.addEventListener('click', e => selectSong(e, false));
        li.addEventListener('touchstart', e => selectSong(e, true), {passive: false});

        songListElement.appendChild(li);
    });
}

// Core function to prepare and play media properly
function prepareAndPlayMedia(isMobile) {
    // Reset video state
    videoIsReady = false;
    videoPlayAttempts = 0;
    
    // Get the current song
    const song = songs[currentSongIndex];
    
    // Setup UI elements
    albumArtPlayer.src = song.albumArtUrl;
    playerTrackTitle.textContent = song.title;
    playerTrackArtist.textContent = song.artist;
    renderLyrics(song.lyrics);
    
    // Reset progress indicators
    playerCurrentTime.textContent = "0:00";
    playerProgressBar.style.width = "0%";
    
    // Make video container visible FIRST
    backgroundVideoContainer.style.display = 'block';
    backgroundVideoContainer.classList.add('active');

    // Set up audio source
    audioPlayer.src = song.audioSrc;
    
    // Set up video source
    backgroundVideo.src = song.videoBgSrc;
    backgroundVideo.muted = true; // Required for autoplay on many browsers
    backgroundVideo.setAttribute('playsinline', '');
    backgroundVideo.setAttribute('webkit-playsinline', '');
    
    // Load both media
    audioPlayer.load();
    backgroundVideo.load();
    
    // Set up handlers for when media is ready
    audioPlayer.onloadedmetadata = () => {
        playerTotalDuration.textContent = formatTime(audioPlayer.duration);
    };
    
    // When video can play, flag it
    backgroundVideo.oncanplay = function() {
        console.log("Video is ready to play");
        videoIsReady = true;
    };
    
    // Handle different play strategies based on device
    if (isMobile) {
        // Mobile: Play immediately
        playBothMediaWithSync(0);
    } else {
        // Desktop: Use a delay with multiple attempts
        playBothMediaWithSync(400);
    }
}

// Function to attempt playing both media with sync
function playBothMediaWithSync(delay) {
    setTimeout(() => {
        // Start audio first (more reliable)
        audioPlayer.play()
            .then(() => {
                console.log("Audio started successfully");
                isPlaying = true;
                updatePlayPauseIcon();
                
                // Then attempt video
                tryPlayingVideo();
            })
            .catch(err => {
                console.error("Audio play failed:", err);
                // If audio fails, try again with user interaction
                isPlaying = false;
                updatePlayPauseIcon();
            });
    }, delay);
}

// Function to try playing video with multiple attempts
function tryPlayingVideo() {
    // If we've tried too many times, stop
    if (videoPlayAttempts >= 3) {
        console.log("Maximum video play attempts reached");
        return;
    }
    
    videoPlayAttempts++;
    console.log(`Video play attempt #${videoPlayAttempts}`);
    
    // Force video element to be visible
    backgroundVideo.style.display = 'block';
    backgroundVideoContainer.style.display = 'block';
    backgroundVideoContainer.classList.add('active');
    
    // Wait a short time and try to play
    setTimeout(() => {
        backgroundVideo.play()
            .then(() => {
                console.log("Video started successfully");
                // Ensure video is properly synced with audio
                if (Math.abs(backgroundVideo.currentTime - audioPlayer.currentTime) > 0.3) {
                    backgroundVideo.currentTime = audioPlayer.currentTime;
                }
            })
            .catch(err => {
                console.error("Video play failed:", err);
                
                // Try again after a short delay
                setTimeout(() => {
                    tryPlayingVideo();
                }, 300);
            });
    }, 200);
}

function showPlayerPage() {
    homePage.classList.remove('active');
    playerPage.classList.add('active');
    
    // Ensure video container is visible
    backgroundVideoContainer.style.display = 'block';
    backgroundVideoContainer.classList.add('active');
}

function showHomePage() {
    playerPage.classList.remove('active');
    homePage.classList.add('active');
    pauseTrack();
    backgroundVideo.pause();
    backgroundVideo.src = "";
    backgroundVideoContainer.classList.remove('active');
    backgroundVideoContainer.style.display = 'none';
}

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

function playTrack() {
    isPlaying = true;
    
    // Try to play audio first
    audioPlayer.play()
        .then(() => {
            // If video is also loaded, play it and sync
            if (videoIsReady) {
                backgroundVideo.currentTime = audioPlayer.currentTime;
                backgroundVideo.play().catch(e => console.log("Video play error:", e));
            } else {
                // Video not ready, try again later
                tryPlayingVideo();
            }
        })
        .catch(e => console.log("Audio play error:", e));
    
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

// Sync video with audio if they drift apart
function syncVideoWithAudio() {
    if (isPlaying && videoIsReady && backgroundVideo.readyState >= 2) {
        // If video and audio are more than 0.3 seconds out of sync
        if (Math.abs(backgroundVideo.currentTime - audioPlayer.currentTime) > 0.3) {
            backgroundVideo.currentTime = audioPlayer.currentTime;
        }
    }
}

// Update UI with current time and sync lyrics
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playerProgressBar.style.width = percent + "%";
        playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);

        // Sync video with audio periodically
        if (audioPlayer.currentTime % 5 < 0.1) { // Every ~5 seconds
            syncVideoWithAudio();
        }

        // Update lyrics highlighting
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

// Allow seeking in the song
playerProgressBarContainer.addEventListener('click', (e) => {
    if (!audioPlayer.duration) return;
    const width = playerProgressBarContainer.clientWidth;
    const clickX = e.offsetX;
    const newTime = (clickX / width) * audioPlayer.duration;
    
    // Update both audio and video time
    audioPlayer.currentTime = newTime;
    if (videoIsReady) {
        backgroundVideo.currentTime = newTime;
    }
});

// Play/pause button
playerPlayPauseBtn.addEventListener('click', () => {
    isPlaying ? pauseTrack() : playTrack();
});

// Back button
backToHomeBtn.addEventListener('click', showHomePage);

// Next track button
playerNextBtn.addEventListener('click', () => {
    if (repeatMode === 1) {
        audioPlayer.currentTime = 0;
        if (videoIsReady) {
            backgroundVideo.currentTime = 0;
        }
        playTrack();
        return;
    }
    
    // Get next track index
    if (isShuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = nextIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    
    // Prepare and play new media
    prepareAndPlayMedia(isMobileDevice());
});

// Previous track button
playerPrevBtn.addEventListener('click', () => {
    if (repeatMode === 1) {
        audioPlayer.currentTime = 0;
        if (videoIsReady) {
            backgroundVideo.currentTime = 0;
        }
        playTrack();
        return;
    }
    
    // Get previous track index
    if (isShuffle) {
        let prevIndex;
        do {
            prevIndex = Math.floor(Math.random() * songs.length);
        } while (prevIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = prevIndex;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    
    // Prepare and play new media
    prepareAndPlayMedia(isMobileDevice());
});

// Shuffle button
if (playerShuffleBtn) {
    playerShuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        playerShuffleBtn.classList.toggle('active-feature', isShuffle);
    });
}

// Repeat button
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

// Speed control
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

// Handle end of track
audioPlayer.addEventListener('ended', () => {
    if (!audioPlayer.loop) {
        playerNextBtn.click();
    }
});

// Utility function to format time
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
    // Set up video container
    initializeVideoContainer();
    
    // Load song list
    renderSongList();
    
    // Initialize UI
    updateRepeatButtonUI();
    
    // Set initial speed if control exists
    if (playerSpeedSlider && audioPlayer) {
        audioPlayer.playbackRate = parseFloat(playerSpeedSlider.value);
        currentSpeedDisplay.textContent = playerSpeedSlider.value + "x";
    }
    
    // Set initial volume if control exists
    if (playerVolumeSlider && audioPlayer) {
        audioPlayer.volume = parseFloat(playerVolumeSlider.value);
    }
});
