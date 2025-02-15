document.addEventListener("DOMContentLoaded", function () {
    const googleFitBtn = document.getElementById("google-fit-btn");

    googleFitBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior

        const apiUrl = "http://127.0.0.1:5000/chat";
        const userId = "default_user"; // Replace with actual user ID if available
        // const message = "Recommend based on Google Fit data";
        const message = "make it healthier";

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: userId, message: message })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from AI Chat:", data.response);
            displayTypingEffect(data.response); // Display response with typing effect
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});

// Function to display text with a typing animation effect
function displayTypingEffect(text) {
    const aiOutputDiv = document.querySelector(".ai-output");
    const messageElement = document.createElement("div");
    messageElement.classList.add("alert", "alert-light", "ai-output-container");
    messageElement.setAttribute("role", "alert", "ai-output-container");
    aiOutputDiv.appendChild(messageElement); // Add new message to ai-output div

    let index = 0;
    messageElement.innerHTML = ""; // Clear the element before appending text
    const typingInterval = setInterval(() => {
        messageElement.innerHTML += text[index];
        index++;
        if (index === text.length) {
            clearInterval(typingInterval); // Stop typing when all text is displayed
            showUserChoice(); // Show the user-choice options after typing finishes
        }
    }, 50); // Delay of 50ms for each character (you can adjust the speed)
}

// Function to show the user-choice options after typing finishes
function showUserChoice() {
    const userChoiceDiv = document.querySelector(".user-choice");
    userChoiceDiv.style.display = "block"; // Make it visible
}
