document.addEventListener('DOMContentLoaded', () => {

    // Steps data
    const steps = [
        "heat the pay with high heat",
        "step 2 instruction here",
        "step 3 instruction here"
    ];

    let currentStep = 0;
    let isListening = false;

    // DOM elements
    const stepContent = document.getElementById('step-content');
    const stepNumber = document.querySelector('.step-number');
    const listeningStatus = document.getElementById('listening-status');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const micBtn = document.getElementById('mic-btn');

    // Update content
    function updateStep() {
        stepContent.textContent = steps[currentStep];
        stepNumber.textContent = currentStep + 1;
        listeningStatus.style.display = isListening ? 'block' : 'none';
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStep();
        }
    });

    micBtn.addEventListener('click', () => {
        isListening = !isListening;
        micBtn.style.backgroundColor = isListening ? '#e0e0e0' : '#f0f0f0';
        updateStep();
    });

    // Initial update
    updateStep();

    // Select the mic button
    const micButton = document.getElementById("mic-btn");

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
        transcript = event.results[event.results.length - 1][0].transcript;
        console.log("Recognized:", transcript);

        // Reset silence timer every time the user speaks
        if (silenceTimer) clearTimeout(silenceTimer);

        // Start a 1-second timer to detect pause
        silenceTimer = setTimeout(() => {
            console.log("User paused. Sending data...");
            sendToBackend(transcript);
            stopListening(); // Stop listening after sending
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
        .then(response => response.json())
        .then(data => console.log("Response from server:", data))
        .catch(error => console.error("Error:", error));
    }

    // Click event to start listening
    micButton.addEventListener("click", () => {
        console.log("Mic button clicked");
        startListening();
    });
});