console.log("SKIPFADE LOADED");

const settings = {
    fadeDuration: 5000, // Default 5 seconds for crossfade duration (adjustable)
};

// Function to handle the fading logic
function main() {
    console.log("Spicetify Crossfade Extension Loaded");

    // Listen for track change (when the song changes)
    spicetify.Player.addEventListener('onTrackChanged', handleTrackChanged);

    // Listen for skip button press (next track) using the spicetify player nextTrack method
    spicetify.Platform.Dispatcher.subscribe('SPOTIFY_ACTION_NEXT', handleSkipAction);

    // Listen for keyboard shortcut for skip (Ctrl+Right or Alt+Right)
    document.addEventListener('keydown', handleKeydown);

    // Handle the track change event
    function handleTrackChanged(track) {
        
        console.log("Track changed:", track);
        fadeOutSong();
    }

    // Handle skip action when the skip button is pressed
    function handleSkipAction(event) {
        console.log("Skip action detected");
        fadeOutSong();
    }

    // Handle keyboard shortcut for skip action (Next Track)
    function handleKeydown(event) {
        console.log("handlekeydown WORKS");
        // Spotify default next track shortcut: Ctrl+Right or Alt+Right
        if (((event.ctrlKey || event.altKey) && event.key === 'ArrowRight')/* || skip button pressed) */){
            console.log("Keyboard shortcut (Ctrl+Right or Alt+Right) detected");
            fadeOutSong();
        }
    }

    // Fade out the current song
    function fadeOutSong() {
        const fadeDuration = settings.fadeDuration;
        const volumeStep = 0.05; // Step size for volume change

        let currentVolume = spicetify.Player.volume;
        console.log("Starting fade-out, current volume:", currentVolume);

        // Gradually decrease the volume to 0 over `fadeDuration` milliseconds
        let fadeOutInterval = setInterval(() => {
            currentVolume -= volumeStep;
            if (currentVolume <= 0) {
                clearInterval(fadeOutInterval);
                spicetify.Player.setVolume(0); // Ensure the volume reaches 0
                spicetify.Player.nextTrack(); // Skip to the next track
                fadeInSong(); // Trigger fade-in for the next track
            } else {
                spicetify.Player.setVolume(currentVolume); // Correct volume control method
            }
        }, fadeDuration / (1 / volumeStep));
    }

    // Fade in the new song
    function fadeInSong() {
        const fadeDuration = settings.fadeDuration;
        const volumeStep = 0.05; // Step size for volume increase

        let currentVolume = 0; // Start from mute
        spicetify.Player.setVolume(currentVolume); // Ensure it's set to mute initially

        console.log("Starting fade-in for new song");

        // Gradually increase the volume to 1 over `fadeDuration` milliseconds
        let fadeInInterval = setInterval(() => {
            currentVolume += volumeStep;
            if (currentVolume >= 1) {
                clearInterval(fadeInInterval);
                spicetify.Player.setVolume(1); // Ensure the volume reaches maximum
            } else {
                spicetify.Player.setVolume(currentVolume); // Correct volume control method
            }
        }, fadeDuration / (1 / volumeStep));
    }

    // Function to adjust the fade duration
    function setFadeDuration(newDuration) {
        settings.fadeDuration = newDuration;
        console.log(`Fade duration set to: ${newDuration}ms`);
    }

    // Add a simple UI to allow users to adjust fade duration
    createSettingsUI();

    function createSettingsUI() {
        // Create a range input element for adjusting fade duration
        const fadeInput = document.createElement('input');
        fadeInput.type = 'range';
        fadeInput.min = 1000; // 1 second
        fadeInput.max = 10000; // 10 seconds
        fadeInput.value = settings.fadeDuration;

        fadeInput.style.position = 'fixed';  // Make sure it's fixed on the screen
        fadeInput.style.top = '20px';
        fadeInput.style.right = '20px';
        fadeInput.style.zIndex = 9999;

        fadeInput.addEventListener('input', (e) => {
            setFadeDuration(e.target.value);
        });

        // Add the input slider to the body
        document.body.appendChild(fadeInput);
    }
}

// Initialize the extension
main();
