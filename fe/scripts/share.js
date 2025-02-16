// Flag for stop recording button
let modalShowed = false;

document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('share-button');
    const modal = document.getElementById('shareModal');
    
    function openModal() {
        modal.classList.add('show');
        modalShowed = true;
    }
    
    function closeModal() {
        modal.classList.remove('show');
        modalShowed = false;
    }
    
    // Expose the openModal function globally
    window.triggerShareModal = openModal;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // Select the save button
    const saveButton = document.querySelector('.save-button');
    
    // Add event listener to call toggleRecording when clicked
    if (saveButton) {
        saveButton.addEventListener('click', toggleRecording);
    }
});