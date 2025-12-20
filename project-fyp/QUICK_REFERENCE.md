# 🗂️ Quick File Reference

## Where to Find Things

### 🔐 Authentication
- Login page: `views/auth/login.ejs`
- Signup page: `views/auth/signup.ejs`
- Controller: `controllers/users.js`

### 🏠 Navigation & Layout
- Main layout: `views/layouts/boiler.ejs`
- Navbar: `views/partials/navbar.ejs`
- Footer: `views/partials/footer.ejs`
- Flash messages: `views/partials/flash.ejs`

### 📍 Listings
- List view: `views/listings/index.ejs`
- Create: `views/listings/new.ejs`
- Edit: `views/listings/edit.ejs`
- Details: `views/listings/show.ejs`
- Controller: `controllers/listings.js`
- CSS: `public/css/pages/listings.css`

### 📅 Bookings
- Create booking: `views/bookings/book.ejs`
- My bookings: `views/bookings/my-bookings.ejs`
- Details: `views/bookings/show.ejs`
- Controller: `controllers/bookings.js`

### 👥 Groups
- Group views: `views/groups/`
- Controller: `controllers/groups.js` (if exists)

### 💰 Pricing & Currency
- Currency converter: `public/js/modules/currencyConverter.js`
- Initialization: `public/js/pages/currency-init.js`
- Styles: `public/css/currency.css`

### 🕐 World Time
- Module: `public/js/modules/worldTime.js`
- Styles: `public/css/pages/time-display.css`

### 🎨 Styling
- **Global reset:** `public/css/base/reset.css`
- **Navbar:** `public/css/components/navbar.css`
- **Footer:** `public/css/components/footer.css`
- **Cards:** `public/css/components/cards.css`
- **Buttons:** `public/css/components/buttons.css`
- **Forms:** `public/css/components/forms.css`
- **Listings layout:** `public/css/pages/listings.css`
- **Hero sections:** `public/css/pages/hero.css`
- **Utilities:** `public/css/pages/utilities.css`

### 🧠 Models
- User: `models/user.js`
- Listing: `models/listing.js`
- Booking: `models/booking.js`
- Travel Package: `models/travelPackage.js`
- Group: `models/group.js`

### ⚙️ Core Files
- Main server: `app.js`
- Dependencies: `package.json`
- Environment: `.env` (not in repo)
- Database seeds: `init/data.js`

## Quick Edits

### To change navbar styling:
Edit: `public/css/components/navbar.css`

### To change button styles:
Edit: `public/css/components/buttons.css`

### To add a new page:
1. Create folder: `views/[feature]/`
2. Add EJS files
3. Create controller: `controllers/[feature].js`
4. Add route handler in controller
5. Create route: `routes/[feature].js`
6. Import route in `app.js`

### To add styling to a new feature:
1. Create: `public/css/pages/[feature].css`
2. Add import in `views/layouts/boiler.ejs`

### To add JavaScript functionality:
1. Module: `public/js/modules/[feature].js`
2. Or Page init: `public/js/pages/[feature].js`
3. Import in `boiler.ejs`

## Common Tasks

**Add a new CSS component:**
```
1. Create: public/css/components/my-component.css
2. Edit: views/layouts/boiler.ejs (add import)
3. Use class: <div class="my-component">
```

**Add a new view for existing feature:**
```
1. Create: views/listings/my-view.ejs (if for listings)
2. Add route in: routes/listings.js
3. Add controller method in: controllers/listings.js
```

**Add global CSS variable:**
```
Edit: public/css/base/reset.css
Add to :root { }
```

**Add JavaScript module:**
```
1. Create: public/js/modules/my-module.js
2. Import in: views/layouts/boiler.ejs
3. Use in page scripts
```

## Port & URLs
- **Development:** http://localhost:8080
- **Database:** MongoDB (localhost:27017 or remote)
- **Assets:** /css/ and /js/ routes

## File Naming Rules
- CSS: kebab-case → `my-component.css`
- JS: camelCase → `myFunction()`
- Views: kebab-case → `my-page.ejs`
- Folders: kebab-case → `my-feature/`
- Classes: PascalCase → `MyClass`

---

**Need to find something? Check the folder structure above!**
