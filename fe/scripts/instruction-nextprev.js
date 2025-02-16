// const stepContent = document.getElementById('step-content');
// const stepNumber = document.querySelector('.step-number');
// const prevBtn = document.getElementById('prev-btn');
// const nextBtn = document.getElementById('next-btn');

// function nextStep() {
//     console.log("GOING TO NEXT STEP"); // Debug
//     fetch("http://127.0.0.1:5000/get_next_step")
//         .then(response => {
//             console.log("Raw response:", response);
//             return response.json();
//         })
//         .then(data => {
//             if (data.step_content !== "END") {
//                 stepContent.textContent = data.step_content;
//                 stepNumber.textContent = data.step_number + 1;
//                 console.log("THIS IS NOT THE END Next Step: ", stepNumber.textContent);
//             } else {
//                 console.log("modal should be open now");
//                 if (typeof triggerShareModal === 'function') {
//                     triggerShareModal(); // Open the share modal
//                 } else {
//                     console.error("triggerShareModal is not a function");
//                 }
//             }
//         })
//         .catch(error => console.error("Error fetching next step:", error));
// }

// function prevStep() {
//     console.log("GOING TO PREV STEP"); // Debug
//     fetch("http://127.0.0.1:5000/get_previous_step")
//         .then(response => response.json())
//         .then(data => {
//             if (data.step_content === "START") {
//                 window.location.href = "index.html";
//             } else {
//                 stepContent.textContent = data.step_content;
//                 stepNumber.textContent = data.step_number + 1;
//             }
//         })
//         .catch(error => console.error("Error fetching previous step:", error));
// }

// document.addEventListener("DOMContentLoaded", function () {
//     // Debugging: Log button presence
//     console.log("prevBtn:", prevBtn);
//     console.log("nextBtn:", nextBtn);

//     // Attach event listeners
//     if (prevBtn) prevBtn.addEventListener("click", prevStep);
//     if (nextBtn) nextBtn.addEventListener("click", nextStep);
// });