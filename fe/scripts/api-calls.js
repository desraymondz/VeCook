// Fetch the next step from the backend and log it
function fetchNextStep() {
    fetch('http://127.0.0.1:5000/get_next_step')
        .then(response => response.json())
        .then(data => {
            console.log("Next Step: ", data.response);  // Log the next step
        })
        .catch(error => {
            console.error("Error fetching the next step:", error);
        });
}

// Fetch the Previous step from the backend and log it
function fetchPreviousStep() {
    fetch('http://127.0.0.1:5000/get_previous_step')
        .then(response => response.json())
        .then(data => {
            console.log("Previous Step: ", data.response);  // Log the Previous step
        })
        .catch(error => {
            console.error("Error fetching the Previous step:", error);
        });
}