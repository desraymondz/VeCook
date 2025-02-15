// Make the mic state and toggle function global
let isMuted = false;

function toggleMic() {
    // Ensure that the DOM elements are accessed only after they are available
    const micButton = document.getElementById("mic-btn");
    const micIcon = micButton.querySelector(".mic-icon");
    const micMuteIcon = micButton.querySelector(".mic-mute-icon");

    // Toggle the mic state
    isMuted = !isMuted;  // Toggle the mute state
    micIcon.style.display = isMuted ? "none" : "flex";  // Show/hide icons based on mute state
    micMuteIcon.style.display = isMuted ? "flex" : "none"; 

    // Start or stop listening based on mute state
    if (isMuted) {
        stopListening();
    } else {
        startListening();
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const listeningStatus = document.getElementById("listening-status");

    const micButton = document.getElementById("mic-btn");
    const micIcon = micButton.querySelector(".mic-icon");
    const micMuteIcon = micButton.querySelector(".mic-mute-icon");

    // Ensure mic is muted by default
    micIcon.style.display = "none";
    micMuteIcon.style.display = "flex";

    // Event listener to toggle mic when button is clicked
    micButton.addEventListener("click", () => {
        toggleMic(); // Toggle the mic state on button click
        console.log("Mic is muted? " + isMuted);
    });

    // Speech recognition setup
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false; // Only return final results
    recognition.lang = "en-US"; // Set language

    let transcript = "";  // Store speech text
    let silenceTimer = null;  // Timer for detecting silence

    // Function to start listening
    function startListening() {
        transcript = ""; // Reset transcript
        recognition.start();
        console.log("Listening...");
    }

    // Function to stop listening
    function stopListening() {
        recognition.stop();
        console.log("Stopped listening.");
    }

    // Event when speech is recognized
    recognition.onresult = (event) => {
        transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Recognized:", transcript);
        listeningStatus.innerHTML = transcript;

        // Reset silence timer every time the user speaks
        if (silenceTimer) clearTimeout(silenceTimer);

        // Start a 1-second timer to detect pause
        silenceTimer = setTimeout(() => {
            console.log("User paused. Sending data...");
            sendToBackend(transcript);

            // Detect commands like "copilot next", "copilot back", and "copilot help"
            if (transcript.includes("copilot") || transcript.includes("co-pilot")) {
                console.log("copilot detected:", transcript);
                if (transcript.includes("next")) {
                    console.log("Command detected: next");
                    nextStep();
                } else if (transcript.includes("back")) {
                    console.log("Command detected: back");
                    prevStep();
                } else if (transcript.includes("help")) {
                    console.log("Command detected: help");
                    sendToBackend();
                }
            }
        }, 1000);
    };

    // Function to send recognized text to backend
    function sendToBackend(text) {
        fetch("http://127.0.0.1:5000/help", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text }) // Send speech as JSON
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // Update the innerHTML of the listening-status with the API response
            const listeningStatus = document.getElementById("listening-status");
            listeningStatus.innerHTML = data.response; // Assuming the API returns an object with a "response" property
    
            // Select the Google US English Female voice
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => 
                voice.name === "Google US English" && voice.gender === "female"
            );
    
            // If the voice is found, use it for speech synthesis
            const utterance = new SpeechSynthesisUtterance(data.response);
            if (selectedVoice) {
                utterance.voice = selectedVoice; // Set to selected Google US Female voice
            }
            
            speechSynthesis.speak(utterance); // This will speak the response
        })
        .catch(error => {
            console.error("Error:", error);
            // Optionally, display an error message if the API call fails
            const listeningStatus = document.getElementById("listening-status");
            listeningStatus.innerHTML = "An error occurred. Please try again.";
    
            // Optional: Handle error in speech as well
            const errorMessage = "Sorry, something went wrong.";
            const utterance = new SpeechSynthesisUtterance(errorMessage);
            speechSynthesis.speak(utterance);
        });
    }
    
    // Expose startListening globally
    window.startListening = startListening;
    window.stopListening = stopListening;

    // Initialize the mic state (muted by default)
    toggleMic();
});
