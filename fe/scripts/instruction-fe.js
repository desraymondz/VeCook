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
});