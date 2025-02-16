document.addEventListener('DOMContentLoaded', function () {
    const chatIcon = document.querySelector('.chat-icon');
    const chatBox = document.querySelector('.chat-box');
    const input = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.chat-messages');

    // Create the floating Google Fit button
    const googleFitButton = document.createElement('button');
    googleFitButton.textContent = 'Recommend based on Google Fit';
    googleFitButton.className = 'google-fit-button';
    googleFitButton.addEventListener('click', handleGoogleFitRecommendation);

    // Insert the button inside the chat input area
    const chatInputContainer = document.querySelector('.chat-input');
    chatInputContainer.appendChild(googleFitButton);

    chatIcon.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });

    function addMessage(content, isUser = false, showButtons = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user' : 'bot'}`;
        message.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;

        if (showButtons) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'response-buttons';

            const yesButton = document.createElement('button');
            yesButton.textContent = 'Yes';
            yesButton.className = 'yes-button';
            yesButton.addEventListener('click', () => handleUserResponse('Yes'));

            const noButton = document.createElement('button');
            noButton.textContent = 'No';
            noButton.className = 'no-button';
            noButton.addEventListener('click', () => handleUserResponse('No'));

            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
            message.appendChild(buttonContainer);
        }

        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSendMessage() {
        const userMessage = input.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, true); // Display user message
        input.value = '';

        // Hide the Google Fit button after user input
        googleFitButton.style.display = 'none';

        try {
            const response = await fetch('http://127.0.0.1:5000/personalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ preference: userMessage })
            });

            const aiResponse = await response.json(); // Get AI response
            addMessage(aiResponse.response?.message || "No response received.", false, true); // Show AI response with Yes/No buttons

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Sorry, something went wrong. Please try again.');
        }
    }

    async function handleGoogleFitRecommendation() {
        // Add user message bubble
        addMessage('Recommend based on Google Fit', true);

        // Hide the Google Fit button after it's clicked
        googleFitButton.style.display = 'none';

        // Call the Google Fit recommendation function
        const recommendationMessage = recommend_google_fit();
        addMessage(recommendationMessage, false); // Show response from Google Fit API
    }

    async function recommend_google_fit() {
        try {
            await requestGoogleFitAccess();
            const steps = await getSteps();
            console.log("Today's steps:", steps);

            // Update UI with steps if you have an element to display it
            const stepsDisplay = document.getElementById('steps-display');
            if (stepsDisplay) {
                stepsDisplay.textContent = `Steps taken today: ${steps}`;
            }

            return "Connected to Google Fit API. Steps data fetched successfully!";
        } catch (error) {
            console.error("Error in recommend_google_fit:", error);
            alert("Error fetching step data. Please try again.");
            return "Failed to fetch steps data.";
        }
    }

    function handleUserResponse(response) {
        addMessage(`You selected: ${response}`, true);

        if (response === 'Yes') {
            setTimeout(() => {
                location.reload(); // Refresh the page after 1 second
            }, 1000);
        }
    }

    sendButton.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});
