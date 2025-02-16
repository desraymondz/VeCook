const startButton = document.getElementById('start-button');

startButton.addEventListener('click', async () => {
    try {
        // Call the API to get the next step
        const response = await fetch('http://127.0.0.1:5000/get_next_step');
        const data = await response.json();

        if (response.ok) {
            // Do something with the response data (step content)
            console.log(`Step ${data.step_number}: ${data.step_content}`);

            // Optionally, you could navigate to another page or show step content elsewhere
            // Example: Redirecting to a new page
            window.location.href = '/next-step-page'; // Replace with your target page URL
        } else {
            // Handle error response
            alert("Sorry, we couldn't fetch the next step. Please try again.");
        }
    } catch (error) {
        console.error('Error fetching the next step:', error);
        alert("An error occurred while fetching the next step. Please try again.");
    }
});