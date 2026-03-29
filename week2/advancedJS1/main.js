import BASE_URL  from './variables.js';
import { fetchData } from './utils.js';
import { restaurantRow, restaurantModal } from './components.js';

const target = document.querySelector('tbody'); // Assuming you use a table
const modal = document.querySelector('#menu-modal');
const modalContent = document.querySelector('#modal-body');

const init = async () => {
    try {
        const restaurants = await fetchData(BASE_URL);
        // Sort restaurants alphabetically using arrow function
        restaurants.sort((a, b) => a.name.localeCompare(b.name));

        restaurants.forEach((restaurant) => {
            const row = restaurantRow(restaurant);
            
            // Add click event to open modal
            row.addEventListener('click', async () => {
                // Highlight the row (Optional UI touch)
                document.querySelectorAll('tr').forEach(tr => tr.classList.remove('highlight'));
                row.classList.add('highlight');

                try {
                    // Fetch daily menu
                    const menu = await fetchData(`${BASE_URL}/daily/${restaurant._id}/fi`);
                    // Show modal and inject component HTML
                    modalContent.innerHTML = restaurantModal(restaurant, menu);
                    modal.style.display = 'flex';
                } catch (err) {
                    alert("Could not load menu: " + err.message);
                }
            });

            target.appendChild(row);
        });
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

// Close modal logic
document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

init();