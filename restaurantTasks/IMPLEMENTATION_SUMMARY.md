# StudentDiscountFOOD - Done! 

## What's Built

### JavaScript Files
- **app.js** - Main app logic
- **api.js** - API calls (with fake data for testing)
- **auth.js** - Login/register forms
- **menu.js** - Menu display
- **map.js** - Map with markers
- **utils.js** - Helper functions

### Pages
- **index.html** - Restaurant list, map, profile
- **login.html** - Login
- **register.html** - Sign up
- **menu.html** - Show menus

### Styling
- **style.css** - Everything looks good (no Bootstrap needed)

## Features

✅ Search restaurants  
✅ Filter by city/provider  
✅ See menus (daily & weekly)  
✅ Map with restaurants  
✅ Login/register users  
✅ Save favorites  
✅ Upload profile pic  
✅ Mobile responsive  

## API Endpoints You Need

```
POST   /auth/register
POST   /auth/login
GET    /auth/profile
PUT    /auth/profile
POST   /auth/profile/picture
GET    /restaurants
GET    /restaurants/:id/menu/daily
GET    /restaurants/:id/menu/weekly
GET    /favorites
POST   /favorites
DELETE /favorites/:id
```

## Deploy

1. Push to GitHub
2. Upload to users.metropolia.fi
3. Or deploy to Netlify/Vercel

Done
