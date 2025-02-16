document.addEventListener('DOMContentLoaded', function() {
    const chatIcon = document.querySelector('.chat-icon');
    const chatBox = document.querySelector('.chat-box');
    const input = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.chat-messages');

    chatIcon.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });

    function addMessage(content, isUser = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user' : 'bot'}`;
        message.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleSendMessage() {
        const message = input.value.trim();
        if (message) {
            addMessage(message, true);
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                addMessage('Thanks for your message! Our team will get back to you soon.');
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