# Project File Structure - MVC Best Practices

## Overview
The project has been reorganized following MVC architecture with separation of concerns for CSS, JavaScript, and views.

---

## 📁 Views Structure (`/views`)

### `/views/layouts/`
- **boiler.ejs** - Main layout template with CSS/JS imports

### `/views/partials/`
- **navbar.ejs** - Navigation component
- **footer.ejs** - Footer component  
- **flash.ejs** - Flash messages component

### `/views/auth/`
- **login.ejs** - Login page
- **signup.ejs** - Signup page

### `/views/bookings/`
- **book.ejs** - Booking form
- **my-bookings.ejs** - User's bookings list
- **show.ejs** - Booking details

### `/views/listings/`
- **index.ejs** - Listings overview
- **new.ejs** - Create new listing
- **edit.ejs** - Edit listing
- **show.ejs** - Listing details
- **expense-details.ejs** - Expense breakdown
- **fares.ejs** - Fare information
- **packages.ejs** - Package listings
- **packageDetail.ejs** - Package details
- **weather-comparison.ejs** - Weather comparison
- **worldtime.ejs** - Time display
- **eventbrite.ejs** - Event integration
- **events.ejs** - Events list
- **h.ejs** - Helper view

### `/views/groups/`
- **show.ejs** - Group details
- *Other group-related views*

### `/views/common/`
- **error.ejs** - Error page
- **destinations/** - Destination-related views (empty placeholder)

---

## 🎨 CSS Structure (`/public/css`)

### `/css/base/`
Base styling applied to all pages:
- **reset.css** - Global reset and base styles

### `/css/components/`
Reusable component styles:
- **navbar.css** - Navigation bar styling
- **footer.css** - Footer styling
- **cards.css** - Card component styles
- **buttons.css** - Button styling
- **forms.css** - Form elements and inputs

### `/css/pages/`
Page-specific styles:
- **listings.css** - Listings page layout
- **hero.css** - Hero sections and showcases
- **utilities.css** - Emergency cards, chat button, groups
- **time-display.css** - Time-related displays

### Root Level (Legacy)
- **style.css** - Legacy global styles (can be deprecated)
- **rating.css** - Star rating component
- **currency.css** - Currency converter widget
- **groups.css** - Group feature styles

---

## 🧩 JavaScript Structure (`/public/js`)

### `/js/modules/`
Reusable utility modules:
- **currencyConverter.js** - Currency conversion logic
- **worldTime.js** - Time conversion utilities

### `/js/pages/`
Page/feature initialization scripts:
- **currency-init.js** - Currency widget initialization

### Root Level
- **script.js** - Main application script

---

## 🛠️ Models (`/models`)
- **user.js** - User schema
- **listing.js** - Listing schema
- **booking.js** - Booking schema
- **review.js** - Review schema
- **travelPackage.js** - Travel package schema
- **group.js** - Group schema
- **message.js** - Message schema
- **TaxiFare.js** - Taxi fare schema
- **Destination.js** - Destination schema

---

## 🎮 Controllers (`/controllers`)
- **users.js** - User authentication and profile
- **listings.js** - Listing CRUD operations
- **bookings.js** - Booking management
- **reviews.js** - Review operations
- **/api/** - API endpoint controllers

---

## 🛣️ Routes (`/routes`)
Feature-based route organization:
- Individual route files for each major feature

---

## 📊 Database (`/dataset`)
- **central_asia_travel_dataset_500.csv** - Travel data
- **central_asia_travel_packages.txt** - Package data (imported to MongoDB)

---

## 🚀 Initialization (`/init`)
- **index.js** - Database initialization
- **data.js** - Seed data
- **seedTaxiFares.js** - Taxi fare seeding

---

## 🔒 Middleware (`/middleware`)
- **jwt.js** - JWT authentication

---

## 🧰 Utils (`/utils`)
- **currencyHelper.js** - Currency conversion utilities

---

## 📝 Naming Conventions

### CSS Classes
- Use kebab-case: `.navbar-brand`, `.card-body`
- Use BEM for complex components: `.card__header`, `.card__body--active`
- Component-specific: `.navbar`, `.footer`, `.card`

### JavaScript
- Use camelCase for variables/functions: `currencyConverter`, `getUserCurrency()`
- Use PascalCase for classes: `CurrencyConverter`
- Use UPPER_SNAKE_CASE for constants: `MAX_PRICE`, `DEFAULT_CURRENCY`

### Views
- Use kebab-case for file names: `error.ejs`, `my-bookings.ejs`
- Match folder structure to features

---

## 🔄 CSS Loading Order (in `boiler.ejs`)

1. **Bootstrap** - Framework CSS
2. **External libraries** - Font Awesome, Google Fonts, Mapbox
3. **Base CSS** - Reset and global styles
4. **Component CSS** - Reusable components
5. **Page CSS** - Page-specific styles
6. **Feature CSS** - Legacy/special feature styles

This order ensures:
- Foundation is loaded first
- Components can override base styles
- Pages can override component styles
- Feature styles can fine-tune specific elements

---

## 🚀 Adding New Features

### To add a new page:
1. Create folder under `/views/[feature-name]/`
2. Add `.ejs` files within the folder
3. Create controller in `/controllers/[feature-name].js`
4. Create routes in `/routes/[feature-name].js`
5. Add CSS in `/public/css/pages/[feature-name].css` if needed
6. Add JavaScript in `/public/js/pages/[feature-name].js` if needed
7. Import routes in `app.js`

### To add a new component:
1. Add CSS in `/public/css/components/[component-name].css`
2. Create EJS partial in `/views/partials/[component-name].ejs`
3. Add JavaScript in `/public/js/modules/[component-name].js` if needed
4. Import CSS in `boiler.ejs`

---

## ✅ Best Practices Implemented

✓ **Separation of Concerns** - CSS, HTML, JavaScript in separate files
✓ **MVC Pattern** - Clear separation of models, views, controllers
✓ **Component-Based** - Reusable CSS and view components
✓ **Feature-Based Organization** - Views organized by feature
✓ **CSS Hierarchy** - Base → Components → Pages
✓ **Module Pattern** - JavaScript utilities in separate modules
✓ **DRY Principle** - Reusable components and functions
✓ **Naming Conventions** - Consistent naming across the project
✓ **Scalability** - Easy to add new features without breaking existing code

---

## 🔗 Global CSS Variables
Consider adding CSS custom properties (CSS variables) to `/css/base/reset.css` for:
- Colors: `--primary`, `--secondary`, `--accent`
- Spacing: `--spacing-sm`, `--spacing-md`, `--spacing-lg`
- Typography: `--font-family`, `--font-size-base`
- Shadows: `--shadow-sm`, `--shadow-md`

Example:
```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --accent: #38bdf8;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

This ensures consistency and makes theming easier in the future.

