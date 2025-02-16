document.addEventListener('DOMContentLoaded', function () {
    fetchIngredients(); // Fetch ingredients on page load

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

        const ingredientsHeader = document.querySelector('.ingredients-header');
        if (ingredientsHeader) {
            ingredientsHeader.style.position = 'relative';
            ingredientsHeader.appendChild(bubble);
        }
    }

    // Fetch ingredients from API and update table
    async function fetchIngredients() {
        const tableBody = document.querySelector('.ingredients-table tbody');

        try {
            const response = await fetch('http://127.0.0.1:5000/get_ingredients');
            const data = await response.json();
            const ingredients = data.response; // Assuming response is a list of ingredient names

            // Clear existing rows
            tableBody.innerHTML = '';

            // Populate table with fetched ingredients
            ingredients.forEach(ingredient => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${ingredient}</td>
                    <td class="checkbox-container">
                        <div class="custom-checkbox"></div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Attach event listeners for new checkboxes
            addCheckboxListeners();
            updateBubbleCount();
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    function addCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.custom-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                checkbox.classList.toggle('checked');
                updateBubbleCount();
            });
        });
    }

    function updateBubbleCount() {
        try {
            const checkedCount = document.querySelectorAll('.custom-checkbox.checked').length;
            const totalCount = document.querySelectorAll('.custom-checkbox').length;

            if (bubble) {
                if (checkedCount >= 0 && checkedCount < totalCount) {
                    bubble.textContent = totalCount - checkedCount;
                    bubble.style.display = 'flex';
                } else {
                    bubble.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error updating bubble count:', error);
        }
    }
});
