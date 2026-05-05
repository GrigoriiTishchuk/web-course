# StudentDiscountFOOD - Web Application

A web app for finding Finnish student restaurants and checking out their menus. Built with vanilla JavaScript and Leaflet maps.

## What It Does

- Browse student restaurants
- Check daily & weekly menus
- Find restaurants on a map
- See which one is closest to you
- Save your favorites
- Create an account & manage profile

## Project Files

## Features Implemented

- Restaurant listing with search  
- Filter by city and provider  
- Interactive map showing all restaurants  
- Highlights your closest restaurant  
- View daily or weekly menus  
- User login & registration  
- Save favorite restaurants  
- Update your profile info  
- Upload a profile picture  
- Works great on mobile

## Project Structure

```
restaurantTasks/
├── index.html           # Main page with restaurant list and map
├── login.html           # Login page
├── register.html        # Registration page
├── menu.html            # Menu display page
├── app.js               # Main app logic
├── api.js               # API calls
├── auth.js              # Login/register logic
├── menu.js              # Menu page logic
├── map.js               # Map setup
├── utils.js             # Helper functions
└── style.css            # All styling
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- Leaflet maps
- Fetch API
- CSS Grid & Flexbox
- LocalStorage for saving stuff

## Getting Started

### Step 1: Set Your API URL
Open `api.js` and change line 6:
```javascript
BASE_URL: 'https://your-api-endpoint.com/api'
```

### Step 2: Run It Locally
```bash
python -m http.server 8000
```

### Step 3: Open in Browser
Go to `http://localhost:8000`

It'll work with mock data right away, so you can test everything before connecting your backend.

## Connect Your Backend

Your app needs these API endpoints:

**Auth**
```
POST   /auth/register         - Create account
POST   /auth/login            - Log in
GET    /auth/profile          - Get user info
PUT    /auth/profile          - Update profile
POST   /auth/profile/picture  - Upload pic
```

**Restaurants**
```
GET    /restaurants                  - Get all
GET    /restaurants/:id/menu/daily   - Daily menu
GET    /restaurants/:id/menu/weekly  - Weekly menu
```

**Favorites**
```
GET    /favorites              - Get favorites
POST   /favorites              - Add favorite
DELETE /favorites/:id          - Remove favorite
```

### Response Formats

Restaurant:
```json
{
  "id": 1,
  "name": "Restaurant Name",
  "address": "Street Address, City",
  "city": "Helsinki",
  "provider": "Sodexo",
  "latitude": 60.1234,
  "longitude": 24.5678
}
```

Daily Menu:
```json
{
  "meals": [
    {"name": "Meal", "price": "8.50", "description": "..."}
  ]
}
```

Weekly Menu:
```json
{
  "days": [
    {"meals": [{"name": "Meal", "price": "8.50"}]}
  ]
}
```

## Development Guide

### Application Architecture

#### State Management (AppState)
All application state is managed in a single `AppState` object:
- `restaurants` - Array of all restaurants
- `filteredRestaurants` - Currently filtered restaurants
- `favorites` - User's favorite restaurants
- `currentUser` - Logged-in user information
- `filters` - Current filter settings

#### UI Rendering (UI)
Functions for rendering different UI components:
- `renderRestaurants()` - Render restaurant list
- `updateAuthUI()` - Update auth-related UI
- `showMenuModal()` - Display menu in modal
- `closeModal()` - Close modal

#### Event Handling (Events)
Centralized event handlers:
- `handleSearch()` - Search input handling
- `handleCityFilter()` - City filter change
- `handleFavoriteClick()` - Favorite button click
- `handleProfileUpdate()` - Profile form submission

#### Map Controller (MapController)
Map-related functionality:
- `initMap()` - Initialize Leaflet map
- `addMarkers()` - Add restaurant markers
- `highlightNearestRestaurant()` - Highlight and center on nearest

### Adding Features

#### Add a New Filter
1. Add filter input to HTML
2. Add filter property to `AppState.filters`
3. Update `AppState.applyFilters()` with new filter logic
4. Create event handler in `Events` object
5. Attach listener in `attachEventListeners()`

#### Modify Menu Display
1. Update expected response format in `MenuPage.renderMenu()`
2. Create new render method if needed
3. Update CSS for new menu layout

## Data Flow

```
User Action → Event Handler → API Call → State Update → UI Re-render
```

Example: Adding a favorite
```
User clicks ❤ button
  → handleFavoriteClick() fires
  → API.addFavorite() called
  → AppState.favorites updated
  → UI.renderRestaurants() called
  → Heart icon changes
```

## Testing with Mock Data

The application includes mock restaurant data for development:

```javascript
// In api.js - getMockRestaurants() provides default data
// This is returned as fallback if API is unavailable
```

To use mock data:
- Either leave API endpoint unconfigured
- Or modify `catch` block in API methods

## Authentication Flow

```
Registration
├── User fills form → auth.js receives data
├── API.register() called with credentials
├── Backend creates user account
├── User redirected to login page

Login
├── User fills credentials → auth.js receives data
├── API.login() called
├── Token received and stored in localStorage
├── User object stored in localStorage
├── Redirected to index.html
└── App detects logged-in user and updates UI
```

## Local Storage Usage

The app uses browser localStorage for:
- `authToken` - JWT or session token
- `user` - Current user object with profile data

```javascript
// Example
localStorage.setItem('user', JSON.stringify(userData));
localStorage.getItem('authToken');
localStorage.removeItem('authToken'); // Logout
```

## Deployment

### To users.metropolia.fi

1. Build/minify files (optional)
2. Upload to server via FTP/SSH
3. Ensure API endpoint is accessible from production
4. Test all features in production environment

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

ES6 modules require:
- HTTP/HTTPS (not file://)
- CORS headers if API on different domain

## Performance Optimization Tips

1. **Lazy Load Maps**: Only initialize Leaflet on index.html
2. **Debounce Search**: Wrap search input handler with debounce
3. **Image Optimization**: Compress profile pictures before upload
4. **Caching**: Store restaurant data to reduce API calls

Example debounce for search:
```javascript
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Use:
searchInput.addEventListener('input', debounce(Events.handleSearch, 300));
```

## Troubleshooting

### "Module not found" error
- Ensure all `.js` files are in the same directory
- Check file paths in import statements
- Use full `.js` extension in imports

### Map not showing
- Verify Leaflet CSS and JS are loaded
- Check browser console for errors
- Ensure `#map` element exists with height/width

### Authentication not working
- Check API endpoint configuration
- Verify CORS headers from backend
- Check localStorage in browser DevTools
- Look for network errors in Network tab

### Favorites not persisting
- Verify token is being sent with requests
- Check backend is storing favorites
- Ensure localStorage has user data

## Future Enhancements

- [ ] Dark mode theme
- [ ] Restaurant ratings and reviews
- [ ] Dietary restriction filters
- [ ] Meal recommendations based on history
- [ ] Notifications for menu updates
- [ ] Export favorites to calendar
- [ ] Social sharing features
- [ ] Offline mode with service workers

## License

Metropolia Web Applications Assignment - Educational Use

## Support

For issues or questions:
1. Check browser console for errors
2. Review network requests in DevTools
3. Verify API endpoint is correct
4. Check GitHub issues

---

**Version**: 1.0
**Status**: Feature Complete, Ready for Backend Integration
