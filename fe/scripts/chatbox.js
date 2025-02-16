document.addEventListener('DOMContentLoaded', function () {
    const chatIcon = document.querySelector('.chat-icon');
    const chatBox = document.querySelector('.chat-box');
    const input = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.chat-messages');

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

        try {
            const response = await fetch('http://127.0.0.1:5000/personalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ preference: userMessage })
            });

            const aiResponse = await response.json(); // Get plain text response
            addMessage(aiResponse.response?.message || "No response received.", false, true); // Show AI response with Yes/No buttons

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Sorry, something went wrong. Please try again.');
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
