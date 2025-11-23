# Bayside Carwash Website

A modern, responsive car wash website built with HTML5, CSS3, and JavaScript, featuring a full-stack admin dashboard for managing packages and pricing. This website showcases professional car care services with a clean, modern design and interactive features.

## 🚀 New: Admin Dashboard

This project now includes a **full-stack admin dashboard** for managing car wash packages!

### Quick Links
- 📖 **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- 🚀 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- 📊 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Complete feature overview

### Admin Features
- 🔐 Secure JWT-based authentication
- 📦 Full CRUD operations for packages (Create, Read, Update, Delete)
- 💰 Manage pricing for single washes and memberships
- ✨ Add/edit/remove features for each package
- 🎯 Set featured packages and display order
- 🔗 Manage subscription URLs
- 📱 Responsive admin interface
- 🗄️ Neon Serverless Postgres database
- ⚡ Vercel serverless functions

### Access
- **Admin Dashboard:** `/admin`
- **Public Washes Page:** `/washes` (now loads data from database)

## 🌟 Features

### Design & User Experience
- **Modern Design**: Clean, professional layout with blue color scheme (#1E40AF)
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Floating Bubble Animation**: CSS-based background animation with floating bubbles
- **Smooth Animations**: Fade-in effects, hover animations, and smooth transitions
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

### Pages & Content
1. **Home Page** (`index.html`)
   - Hero section with engaging headline and call-to-action
   - Features showcasing car wash technology
   - Benefits section highlighting convenience, quality, and eco-friendliness
   - Location information and contact details

2. **Washes Page** (`washes.html`)
   - Dynamic package loading from database
   - Four wash packages: Express, Deluxe, Ultimate, Platinum
   - Detailed service descriptions for each package
   - Single wash and membership pricing
   - Call-to-action buttons with subscription links
   - Fallback to hardcoded data if API unavailable

3. **Detailing Page** (`detailing.html`)
   - Interior, exterior, and engine cleaning services
   - Additional services: paint correction, ceramic coating, upholstery cleaning
   - Customer testimonials and success statistics
   - Service pricing and booking options

4. **Contact Page** (`contact.html`)
   - Contact form with validation
   - Contact information (phone, email, address)
   - Location details with facility features
   - Operating hours and service expectations

5. **About Page** (`about.html`)
   - Company mission and values
   - Company history timeline
   - Team member profiles
   - Customer testimonials and expansion plans

### Technical Features
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Form Validation**: Client-side validation for contact forms
- **Smooth Scrolling**: Smooth navigation between sections
- **Interactive Elements**: Hover effects, button animations, and card interactions
- **SEO Optimized**: Proper meta tags, semantic HTML, and structured content

## 🚀 Getting Started

### For Viewing the Website
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Navigate through the website using the navigation menu

### For Setting Up Admin Dashboard

**Prerequisites:**
- Node.js 18+ installed
- Neon account (free tier available)
- Vercel account (free tier available)

**Quick Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon connection string and JWT secret

# 3. Run database migration
npm run migrate

# 4. Deploy to Vercel
vercel --prod
```

📖 **See [QUICK_START.md](QUICK_START.md) for detailed instructions**

### File Structure
```
bayside-carwash/
├── index.html              # Home page
├── washes.html             # Car wash packages page (dynamic)
├── detailing.html          # Auto detailing services page
├── contact.html            # Contact information and form
├── about.html              # About us page
├── admin.html              # Admin dashboard
├── api/                    # Serverless API endpoints
│   ├── auth/               # Authentication endpoints
│   │   ├── login.js        # Admin login
│   │   ├── verify.js       # Token verification
│   │   └── setup.js        # Initial admin setup
│   └── packages/           # Package CRUD endpoints
│       ├── index.js        # GET all, POST new
│       └── [id].js         # GET, PUT, DELETE by ID
├── lib/                    # Shared utilities
│   ├── db.js               # Database connection
│   └── auth.js             # Authentication utilities
├── scripts/                # Utility scripts
│   └── migrate-data.js     # Database migration
├── sql/                    # Database schemas
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Seed data
├── css/
│   ├── style.css           # Main stylesheet
│   └── animations.css      # Animation styles
├── js/
│   ├── main.js             # Main JavaScript
│   ├── admin.js            # Admin dashboard logic
│   └── washes.js           # Dynamic package loading
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel configuration
├── README.md               # This file
├── QUICK_START.md          # Quick setup guide
├── DEPLOYMENT_GUIDE.md     # Detailed deployment guide
└── IMPLEMENTATION_SUMMARY.md  # Feature summary
```

## 🎨 Customization

### Colors
The website uses CSS custom properties for easy color customization:
```css
:root {
    --primary-blue: #1E40AF;
    --primary-blue-light: #3B82F6;
    --primary-blue-dark: #1E3A8A;
    --white: #FFFFFF;
    --light-gray: #F8FAFC;
    --gray: #64748B;
    --dark-gray: #334155;
    --black: #1E293B;
}
```

### Content
- Update text content in the HTML files
- Replace placeholder images with actual car wash photos
- Modify contact information and business details
- Customize service packages and pricing

### Styling
- Modify `css/style.css` for layout and component styling
- Adjust `css/animations.css` for animation effects
- Update bubble animation parameters for different visual effects

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Mobile**: 480px and below
- **Tablet**: 481px - 768px
- **Desktop**: 769px and above

### Mobile Features
- Hamburger navigation menu
- Single-column layouts
- Touch-friendly buttons and forms
- Optimized typography and spacing

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Development

### Adding New Pages
1. Create a new HTML file following the existing structure
2. Include the navigation, bubble animation, and footer
3. Add corresponding CSS styles to `style.css`
4. Update navigation links in all pages

### Modifying Styles
- Main styles are in `css/style.css`
- Animations are in `css/animations.css`
- Use CSS custom properties for consistent theming
- Follow the existing naming conventions

### JavaScript Functionality
- Mobile navigation toggle
- Form validation
- Smooth scrolling
- Scroll animations
- Interactive effects

## 🔐 Security

The admin dashboard implements:
- JWT-based authentication with 7-day expiration
- Bcrypt password hashing (10 rounds)
- Protected API endpoints
- SQL injection prevention
- Environment variable protection
- CORS configuration

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid and Flexbox
- No frontend framework dependencies

### Backend
- Vercel Serverless Functions (Node.js)
- Neon Serverless Postgres
- JWT for authentication
- Bcrypt for password hashing

### Deployment
- Vercel (frontend + serverless functions)
- Neon (database)

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[README_DATABASE_SETUP.md](README_DATABASE_SETUP.md)** - Database setup details
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Feature overview

## 🆘 Support

For issues or questions:
1. Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) troubleshooting section
2. Review Vercel logs: `vercel logs`
3. Check Neon database logs in the console
4. Verify environment variables are set correctly

## 📄 License

This website is owned by Bayside Carwash and protected under the MIT License. The code is accessible for educational purposes and for future developers.

---

**Bayside Carwash** - Professional car care services with a commitment to quality and environmental responsibility. 