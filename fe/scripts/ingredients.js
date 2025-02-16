document.addEventListener('DOMContentLoaded', function () {
    // Your existing code remains the same until the updateBubbleCount function
    
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-button') && !event.target.parentNode.matches('.dropdown-button')) {
            dropdownContent.style.display = 'none';
        }
    });

    // Servings selection
    const servingsOptions = document.querySelectorAll('.dropdown-content a');
    servingsOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const servings = parseInt(e.target.getAttribute('data-servings'));

            dropdownButton.innerHTML = `${servings} Serving${servings > 1 ? 's' : ''} <span>▼</span>`;
            
            const measurements = document.querySelectorAll('.measurement');
            measurements.forEach(measurement => {
                const baseAmount = parseFloat(measurement.getAttribute('data-base'));
                const type = measurement.getAttribute('data-type');
                
                if (type === 'count') {
                    const newAmount = Math.round(baseAmount * servings / 2);
                    measurement.textContent = `${newAmount} LARGE`;
                } else {
                    const newAmount = (baseAmount * servings / 2).toFixed(2).replace(/\.00$/, '');
                    const unit = measurement.textContent.split(' ')[1];
                    measurement.textContent = `${newAmount} ${unit}`;
                }
            });
            
            dropdownContent.style.display = 'none';
        });
    });

    // Checkbox functionality
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            updateBubbleCount();
        });
    });

    // Create bubble element if it doesn't exist
    let bubble = document.querySelector('.bubble');
    if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.cssText = `
            display: none;
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        `;
        
        // Find a suitable parent element to append the bubble
        const ingredientsHeader = document.querySelector('.ingredients-header');
        if (ingredientsHeader) {
            ingredientsHeader.style.position = 'relative';
            ingredientsHeader.appendChild(bubble);
        }
    }

    // Updated updateBubbleCount function with error handling
    function updateBubbleCount() {
        try {
            const checkedCount = document.querySelectorAll('.custom-checkbox.checked').length;
            if (bubble) {
                if (checkedCount > 0) {
                    bubble.textContent = checkedCount;
                    bubble.style.display = 'flex';
                } else {
                    bubble.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error updating bubble count:', error);
        }
    }

    // Initialize bubble count
    updateBubbleCount();

    // Start cooking buttons
    const startButton = document.querySelector('.start-button');
    const startCookingNav = document.getElementById('start-cooking-nav');

    function startCooking() {
        alert('Let\'s start cooking! First, preheat your oven to 350°F (175°C).');
    }

    startButton?.addEventListener('click', startCooking);
    startCookingNav?.addEventListener('click', (e) => {
        e.preventDefault();
        startCooking();
    });
});