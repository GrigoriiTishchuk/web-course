const BASE_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const currentLang = 'fi';
let allRestaurants = []; // Global storage for filtering

// 1. Fetch and Display All Restaurants
async function initApp() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        allRestaurants = await response.json();
        // Render Initial UI
        displayRestaurants(allRestaurants);
        renderMapMarkers(allRestaurants);
        setupFilters();

    } catch (error) {
        showError('list-container', `Failed to load restaurants: ${error.message}. Ensure you are on the VPN.`);
    }
}

// 2. Display List Logic
function displayRestaurants(restaurants) {
    const list = document.getElementById('list-container');
    list.innerHTML = '';

    if (restaurants.length === 0) {
        list.innerHTML = '<p>No restaurants found matching your search.</p>';
        return;
    }

    restaurants.forEach(res => {
        const card = document.createElement('article');
        card.className = 'card restaurant-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${res.name}</h3>
                <span class="badge">${res.company}</span>
            </div>
            <p>${res.address}, ${res.city}</p>
            <div class="card-actions">
                <button class="btn-sm" onclick="getMenu('${res._id}', 'daily')">Daily Menu</button>
                <button class="btn-sm outline" onclick="getMenu('${res._id}', 'weekly')">Weekly Menu</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// 3. Render Map Markers
function renderMapMarkers(restaurants) {
    restaurants.forEach(res => {
        const [lng, lat] = res.location.coordinates;
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<b>${res.name}</b><br>${res.address}<br><button onclick="getMenu('${res._id}', 'daily')">View Menu</button>`);
    });
}

// 4. Filter Logic
function setupFilters() {
    const searchInput = document.getElementById('restaurant-search');
    const cityFilter = document.getElementById('city-filter');
    const providerFilter = document.getElementById('provider-filter');

    const runFilters = () => {
        const query = searchInput.value.toLowerCase();
        const city = cityFilter.value;
        const provider = providerFilter.value;
        const filtered = allRestaurants.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(query);
            const matchesCity = city === "" || res.city === city;
            const matchesProvider = provider === "" || res.company === provider;
            return matchesSearch && matchesCity && matchesProvider;
        });

        displayRestaurants(filtered);
    };

    searchInput.addEventListener('input', runFilters);
    cityFilter.addEventListener('change', runFilters);
    providerFilter.addEventListener('change', runFilters);
}

// 5. Menu Fetching
async function getMenu(id, type) {
    const modal = document.getElementById('menu-modal');
    const modalBody = document.getElementById('modal-body');
    
    modal.style.display = 'flex';
    modalBody.innerHTML = '<p>Loading menu...</p>';

    try {
        const endpoint = type === 'daily' ? `daily/${id}/${currentLang}` : `weekly/${id}/${currentLang}`;
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        
        if (!response.ok) throw new Error('Menu not available.');

        const data = await response.json();
        
        if (type === 'daily') {
            renderDaily(data.courses);
        } else {
            renderWeekly(data.days);
        }

    } catch (error) {
        modalBody.innerHTML = `<p class="error">Menu Error: ${error.message}</p>`;
    }
}

// 6. Rendering Daily/Weekly
function renderDaily(courses) {
    const modalBody = document.getElementById('modal-body');
    let html = '<h3>Today\'s Menu</h3><table class="menu-table"><thead><tr><th>Course</th><th>Diets</th><th>Price</th></tr></thead><tbody>';
    
    if (!courses || courses.length === 0) {
        html += '<tr><td colspan="3">No menu available.</td></tr>';
    } else {
        courses.forEach(c => {
            html += `<tr><td>${c.name}</td><td><span class="diet-tag">${c.diets || ''}</span></td><td>${c.price || '-'}</td></tr>`;
        });
    }
    html += '</tbody></table>';
    modalBody.innerHTML = html;
}

function renderWeekly(days) {
    const modalBody = document.getElementById('modal-body');
    let html = '<h3>Weekly Menu</h3>';
    days.forEach(day => {
        html += `<div class="day-section"><h4>${day.date}</h4><ul>`;
        day.courses.forEach(c => {
            html += `<li><strong>${c.name}</strong> - ${c.price || ''}</li>`;
        });
        html += `</ul></div>`;
    });
    modalBody.innerHTML = html;
}

// 7. Modal Closing Logic
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('menu-modal').style.display = 'none';
});

// Close modal when clicking outside the content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('menu-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function showError(containerId, msg) {
    document.getElementById(containerId).innerHTML = `<div class="error">⚠️ ${msg}</div>`;
}

// Start
initApp();