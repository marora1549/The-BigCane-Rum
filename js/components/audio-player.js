/**
 * Audio Player Component
 * 
 * This module handles the functionality of the audio player component
 * that adds background music and ambient sounds to The Big Cane website.
 * It provides play/pause, volume control, and track information features.
 * 
 * @version 1.1.0
 * @updated 2025-05-18
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initAudioPlayer();
    });

    /**
     * Initialize the audio player component
     */
    function initAudioPlayer() {
        // Get required DOM elements
        const audioPlayer = document.querySelector('.audio-player');
        const audioElement = document.getElementById('backgroundAudio');
        
        // Exit if the audio player doesn't exist on this page
        if (!audioPlayer || !audioElement) return;
        
        // Player controls
        const playButton = audioPlayer.querySelector('.audio-player__button--play');
        const prevButton = audioPlayer.querySelector('.audio-player__button--prev');
        const nextButton = audioPlayer.querySelector('.audio-player__button--next');
        const volumeButton = audioPlayer.querySelector('.audio-player__volume-icon');
        const volumeSlider = audioPlayer.querySelector('.audio-player__volume-slider');
        const volumeFill = audioPlayer.querySelector('.audio-player__volume-fill');
        const progressBar = audioPlayer.querySelector('.audio-player__progress-bar');
        const progressFill = audioPlayer.querySelector('.audio-player__progress-fill');
        const currentTimeDisplay = audioPlayer.querySelector('.audio-player__current');
        const durationDisplay = audioPlayer.querySelector('.audio-player__duration');
        const toggleButton = audioPlayer.querySelector('.audio-player__toggle');
        const trackDisplay = audioPlayer.querySelector('.audio-player__track');
        const artistDisplay = audioPlayer.querySelector('.audio-player__artist');
        
        // Track information - would come from a database in a real application
        const tracks = [
            {
                title: "Island Lounge Mix",
                artist: "The Big Cane Sound",
                source: "../assets/audio/caribbean-lounge-mix.mp3"
            },
            {
                title: "Tropical Beats",
                artist: "The Big Cane Sound",
                source: "../assets/audio/tropical-beats.mp3"
            },
            {
                title: "Midnight Party Vibe",
                artist: "The Big Cane Sound",
                source: "../assets/audio/midnight-party-vibe.mp3"
            }
        ];
        
        // Current track index
        let currentTrack = 0;
        
        // Check if audio preference exists in local storage
        const audioEnabled = localStorage.getItem('audioEnabled') === 'true';
        if (audioEnabled) {
            audioPlayer.classList.add('active');
            // Don't autoplay as browsers block this without user interaction
        }
        
        // Initialize player state
        initializePlayerState();
        
        // Add event listeners
        addEventListeners();
        
        /**
         * Initialize the player's initial state
         */
        function initializePlayerState() {
            // Set initial volume
            const savedVolume = localStorage.getItem('audioVolume');
            if (savedVolume) {
                audioElement.volume = parseFloat(savedVolume);
                volumeFill.style.width = (parseFloat(savedVolume) * 100) + '%';
            } else {
                // Default volume - 70%
                audioElement.volume = 0.7;
                volumeFill.style.width = '70%';
                localStorage.setItem('audioVolume', 0.7);
            }
            
            // Set initial mute state
            const savedMute = localStorage.getItem('audioMuted') === 'true';
            if (savedMute) {
                audioElement.muted = true;
                volumeButton.querySelector('i').className = 'fas fa-volume-mute';
            }
            
            // Update track information display
            updateTrackInfo();
        }
        
        /**
         * Add all event listeners for the audio player
         */
        function addEventListeners() {
            // Play/Pause button
            if (playButton) {
                playButton.addEventListener('click', togglePlayPause);
            }
            
            // Previous track button
            if (prevButton) {
                prevButton.addEventListener('click', playPreviousTrack);
            }
            
            // Next track button
            if (nextButton) {
                nextButton.addEventListener('click', playNextTrack);
            }
            
            // Volume mute toggle
            if (volumeButton) {
                volumeButton.addEventListener('click', toggleMute);
            }
            
            // Volume slider
            if (volumeSlider) {
                volumeSlider.addEventListener('click', adjustVolume);
            }
            
            // Progress bar
            if (progressBar) {
                progressBar.addEventListener('click', seekToPosition);
            }
            
            // Toggle player visibility
            if (toggleButton) {
                toggleButton.addEventListener('click', togglePlayerVisibility);
            }
            
            // Audio element event listeners
            if (audioElement) {
                // Update time display as audio plays
                audioElement.addEventListener('timeupdate', updateTimeDisplay);
                
                // Update duration once metadata is loaded
                audioElement.addEventListener('loadedmetadata', updateDuration);
                
                // Play next track when current one ends
                audioElement.addEventListener('ended', playNextTrack);
                
                // Handle loading errors
                audioElement.addEventListener('error', handleAudioError);
            }
            
            // Handle keyboard controls
            document.addEventListener('keydown', handleKeyboardControl);
        }
        
        /**
         * Toggle play/pause state
         */
        function togglePlayPause() {
            if (!playButton) return;
            
            if (audioElement.paused) {
                audioElement.play()
                    .then(() => {
                        playButton.querySelector('i').className = 'fas fa-pause';
                        audioPlayer.classList.add('active');
                        localStorage.setItem('audioEnabled', 'true');
                    })
                    .catch(error => {
                        console.error('Playback failed:', error);
                        // Handle autoplay policy restrictions
                        showPlaybackNotification();
                    });
            } else {
                audioElement.pause();
                playButton.querySelector('i').className = 'fas fa-play';
            }
        }
        
        /**
         * Play the previous track in the playlist
         */
        function playPreviousTrack() {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            loadTrack();
            
            // If the player was playing, continue playing the new track
            if (!audioElement.paused) {
                audioElement.play()
                    .catch(error => console.error('Failed to play previous track:', error));
            }
        }
        
        /**
         * Play the next track in the playlist
         */
        function playNextTrack() {
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack();
            
            // If the player was playing, continue playing the new track
            if (!audioElement.paused) {
                audioElement.play()
                    .catch(error => console.error('Failed to play next track:', error));
            }
        }
        
        /**
         * Toggle mute state
         */
        function toggleMute() {
            if (!volumeButton) return;
            
            audioElement.muted = !audioElement.muted;
            
            if (audioElement.muted) {
                volumeButton.querySelector('i').className = 'fas fa-volume-mute';
                volumeFill.style.width = '0%';
            } else {
                updateVolumeIcon();
                volumeFill.style.width = (audioElement.volume * 100) + '%';
            }
            
            localStorage.setItem('audioMuted', audioElement.muted);
        }
        
        /**
         * Adjust volume based on click position in the volume slider
         * @param {Event} e - Click event
         */
        function adjustVolume(e) {
            if (!volumeSlider || !volumeFill) return;
            
            const rect = volumeSlider.getBoundingClientRect();
            const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            
            audioElement.volume = position;
            volumeFill.style.width = (position * 100) + '%';
            
            // Unmute if volume is adjusted
            if (audioElement.muted && position > 0) {
                audioElement.muted = false;
                localStorage.setItem('audioMuted', 'false');
            }
            
            // Update volume icon based on level
            updateVolumeIcon();
            
            // Save volume preference
            localStorage.setItem('audioVolume', position);
        }
        
        /**
         * Update the volume icon based on current volume level
         */
        function updateVolumeIcon() {
            if (!volumeButton) return;
            
            if (audioElement.muted || audioElement.volume === 0) {
                volumeButton.querySelector('i').className = 'fas fa-volume-mute';
            } else if (audioElement.volume < 0.4) {
                volumeButton.querySelector('i').className = 'fas fa-volume-off';
            } else if (audioElement.volume < 0.7) {
                volumeButton.querySelector('i').className = 'fas fa-volume-down';
            } else {
                volumeButton.querySelector('i').className = 'fas fa-volume-up';
            }
        }
        
        /**
         * Seek to position in track based on progress bar click
         * @param {Event} e - Click event 
         */
        function seekToPosition(e) {
            if (!progressBar || !audioElement.duration) return;
            
            const rect = progressBar.getBoundingClientRect();
            const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            
            audioElement.currentTime = position * audioElement.duration;
        }
        
        /**
         * Toggle the visibility of the audio player
         */
        function togglePlayerVisibility() {
            audioPlayer.classList.toggle('minimized');
            
            // Save state in localStorage
            localStorage.setItem('audioPlayerMinimized', audioPlayer.classList.contains('minimized'));
        }
        
        /**
         * Update the current time display during playback
         */
        function updateTimeDisplay() {
            if (!progressFill || !currentTimeDisplay) return;
            
            // Update progress bar
            const percent = (audioElement.currentTime / audioElement.duration) * 100 || 0;
            progressFill.style.width = percent + '%';
            
            // Update current time display
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
        }
        
        /**
         * Update duration display once metadata is loaded
         */
        function updateDuration() {
            if (!durationDisplay) return;
            
            durationDisplay.textContent = formatTime(audioElement.duration);
        }
        
        /**
         * Format seconds into MM:SS format
         * @param {number} seconds - Time in seconds
         * @returns {string} Formatted time string
         */
        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '0:00';
            
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
        
        /**
         * Load the current track
         */
        function loadTrack() {
            // Get current track info
            const track = tracks[currentTrack];
            
            // Update audio source
            audioElement.src = track.source;
            
            // Update track information display
            updateTrackInfo();
            
            // Load the audio
            audioElement.load();
        }
        
        /**
         * Update the track information display
         */
        function updateTrackInfo() {
            if (!trackDisplay || !artistDisplay) return;
            
            const track = tracks[currentTrack];
            
            trackDisplay.textContent = track.title;
            artistDisplay.textContent = track.artist;
        }
        
        /**
         * Handle keyboard controls for accessibility
         * @param {KeyboardEvent} e - Keyboard event
         */
        function handleKeyboardControl(e) {
            // Only handle keyboard events when player is focused
            if (!audioPlayer.contains(document.activeElement)) return;
            
            switch (e.key) {
                case ' ':
                case 'k':
                    // Space or K key - Toggle play/pause
                    e.preventDefault();
                    togglePlayPause();
                    break;
                    
                case 'ArrowRight':
                    // Right arrow - Forward 10 seconds
                    e.preventDefault();
                    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
                    break;
                    
                case 'ArrowLeft':
                    // Left arrow - Rewind 10 seconds
                    e.preventDefault();
                    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
                    break;
                    
                case 'ArrowUp':
                    // Up arrow - Increase volume
                    e.preventDefault();
                    audioElement.volume = Math.min(1, audioElement.volume + 0.1);
                    volumeFill.style.width = (audioElement.volume * 100) + '%';
                    updateVolumeIcon();
                    localStorage.setItem('audioVolume', audioElement.volume);
                    break;
                    
                case 'ArrowDown':
                    // Down arrow - Decrease volume
                    e.preventDefault();
                    audioElement.volume = Math.max(0, audioElement.volume - 0.1);
                    volumeFill.style.width = (audioElement.volume * 100) + '%';
                    updateVolumeIcon();
                    localStorage.setItem('audioVolume', audioElement.volume);
                    break;
                    
                case 'm':
                    // M key - Toggle mute
                    e.preventDefault();
                    toggleMute();
                    break;
                    
                case 'n':
                    // N key - Next track
                    e.preventDefault();
                    playNextTrack();
                    break;
                    
                case 'p':
                    // P key - Previous track
                    e.preventDefault();
                    playPreviousTrack();
                    break;
            }
        }
        
        /**
         * Handle audio loading errors
         * @param {Event} e - Error event
         */
        function handleAudioError(e) {
            console.error('Audio playback error:', e);
            
            // Show user-friendly error notification
            if (window.showNotification) {
                window.showNotification(
                    'Audio Error',
                    'There was an error playing the audio track. Please try again later.',
                    'error'
                );
            }
            
            // Reset play button state
            if (playButton) {
                playButton.querySelector('i').className = 'fas fa-play';
            }
        }
        
        /**
         * Show a notification when autoplay is blocked by browser policy
         */
        function showPlaybackNotification() {
            if (window.showNotification) {
                window.showNotification(
                    'Playback Notice',
                    'Audio playback requires user interaction. Click the play button again to start audio.',
                    'info',
                    5000
                );
            }
        }
    }
})();