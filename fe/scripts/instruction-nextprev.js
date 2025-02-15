const stepContent = document.getElementById('step-content');
const stepNumber = document.querySelector('.step-number');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function nextStep() {
    console.log("GOING TO NEXT STEP"); // Debug
    fetch("http://127.0.0.1:5000/get_next_step")
        .then(response => {
            console.log("Raw response:", response);
            return response.json();
        })
        .then(data => {
            if (data.step_content !== "END") {
                stepContent.textContent = data.step_content;
                stepNumber.textContent = data.step_number + 1;
            }
        })
        .catch(error => console.error("Error fetching next step:", error));
}

function prevStep() {
    console.log("GOING TO PREV STEP"); // Debug
    fetch("http://127.0.0.1:5000/get_previous_step")
        .then(response => response.json())
        .then(data => {
            if (data.step_content !== "START") {
                stepContent.textContent = data.step_content;
                stepNumber.textContent = data.step_number + 1;
            }
        })
        .catch(error => console.error("Error fetching previous step:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    // Debugging: Log button presence
    console.log("prevBtn:", prevBtn);
    console.log("nextBtn:", nextBtn);

    // Attach event listeners
    if (prevBtn) prevBtn.addEventListener("click", prevStep);
    if (nextBtn) nextBtn.addEventListener("click", nextStep);
});
