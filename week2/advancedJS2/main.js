import  BASE_URL  from './variables.js';
import { fetchData } from './utils.js';
import { restaurantRow, restaurantModal } from './components.js';

const target = document.querySelector('tbody');
const modal = document.querySelector('#menu-modal');
const modalContent = document.querySelector('#modal-body');

// 1. State management: Store the full list globally after fetching
let allRestaurants = [];

const displayRestaurants = (restaurants) => {
    target.innerHTML = ''; // Clear the table
    
    // Higher-Order Function: forEach
    restaurants.forEach((restaurant) => {
        const row = restaurantRow(restaurant);
        row.addEventListener('click', async () => {
            try {
                const menu = await fetchData(`${BASE_URL}/daily/${restaurant._id}/fi`);
                modalContent.innerHTML = restaurantModal(restaurant, menu);
                modal.style.display = 'flex';
            } catch (err) {
                // Robust Error Handling
                modalContent.innerHTML = `<p class="error">⚠️ Error loading menu: ${err.message}</p>`;
                modal.style.display = 'flex';
            }
        });
        
        target.appendChild(row);
    });
};

const init = async () => {
    try {
        // Fetch data once
        allRestaurants = await fetchData(BASE_URL);
        // Initial alphabetical sort using arrow function
        allRestaurants.sort((a, b) => a.name.localeCompare(b.name));
        // Initial display
        displayRestaurants(allRestaurants);
        setupFilterButtons();

    } catch (error) {
        target.innerHTML = `<tr><td colspan="3" class="error">Failed to load restaurants. check VPN.</td></tr>`;
    }
};

// 2. Filter Logic using .filter()
const setupFilterButtons = () => {
    const sodexoBtn = document.querySelector('#filter-sodexo');
    const compassBtn = document.querySelector('#filter-compass');
    const resetBtn = document.querySelector('#filter-all');
    sodexoBtn.addEventListener('click', () => {
        // Use filter Sodexo
        const filtered = allRestaurants.filter(res => res.company === 'Sodexo');
        displayRestaurants(filtered);
    });
    compassBtn.addEventListener('click', () => {
        // Use filter Compass Group
        const filtered = allRestaurants.filter(res => res.company === 'Compass Group');
        displayRestaurants(filtered);
    });

    resetBtn.addEventListener('click', () => {
        displayRestaurants(allRestaurants);
    });
};

document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

init();