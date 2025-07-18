# BuckeyeRide - Carpooling App for Ohio State University

BuckeyeRide is a modern, comprehensive carpooling application designed specifically for the Ohio State University community. Built with a clean, Uber-inspired design and featuring Ohio State's signature red color scheme, BuckeyeRide connects Buckeyes through smart carpooling technology that prioritizes safety, compatibility, and convenience.

## 🚗 Features

### Public Pages
- **Homepage**: Modern landing page with ride search functionality
- **About Page**: Detailed information about BuckeyeRide's mission and features
- **Authentication**: Secure login and signup with OSU email verification

### Dashboard Features
- **Profile Completion**: Comprehensive profile system with preferences matching
- **Schedule Management**: Add and manage weekly ride schedules
- **Smart Matching**: Find compatible riders based on detailed preferences
- **Groups**: Create and join carpooling groups with friends and classmates
- **Carpooling Buddies**: Build lasting connections with regular ride partners
- **Ride Management**: Check-in/check-out system with post-ride rating and buddy requests

### Key Differentiators
- **OSU-Specific**: Designed exclusively for Ohio State community members
- **Smart Matching Algorithm**: Matches based on music preferences, smoking policy, talkativeness, pet policy, and more
- **Group Carpooling**: Coordinate rides within friend groups or organizations
- **Buddy System**: Priority matching with trusted carpool partners
- **Safety First**: Comprehensive safety features and OSU email verification

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Google Fonts (Inter)
- **Design**: Mobile-first responsive design
- **Storage**: LocalStorage for demo data persistence
- **Architecture**: Modular JavaScript with separation of concerns

## 📁 Project Structure

```
BuckeyeRide/
├── index.html              # Homepage
├── about.html              # About page
├── login.html              # Login page
├── signup.html             # Signup page
├── dashboard/              # Protected dashboard area
│   ├── profile.html        # Profile completion
│   ├── schedules.html      # Schedule management
│   ├── findmatches.html    # Match finding with filters
│   ├── groups.html         # Group management
│   ├── buddies.html        # Carpooling buddies
│   └── ride.html           # Active ride management
├── css/
│   ├── style.css           # Main stylesheet
│   └── responsive.css      # Responsive design
├── js/
│   ├── main.js             # Global functionality
│   ├── auth.js             # Authentication logic
│   └── dashboard.js        # Dashboard functionality
└── README.md               # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary Red**: #D32F2F (Ohio State scarlet)
- **Dark Red**: #B71C1C
- **Light Red**: #FFEBEE
- **Neutrals**: Black, white, and various grays
- **Accent**: Gold (#FFD700) for ratings

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hierarchy**: Clear heading structure with consistent sizing
- **Accessibility**: High contrast ratios and readable font sizes

### Components
- **Cards**: Consistent card design with shadows and rounded corners
- **Buttons**: Primary (red) and secondary (outlined) button styles
- **Forms**: Clean form design with validation states
- **Navigation**: Sticky header with clear active states

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for best experience)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser, or
3. Serve the files using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Usage
1. **Browse Public Pages**: Start at `index.html` to explore the homepage and about page
2. **Create Account**: Sign up with an OSU email address
3. **Complete Profile**: Fill out your preferences for better matching
4. **Add Schedules**: Input your regular ride schedules
5. **Find Matches**: Use filters to find compatible carpool partners
6. **Join Groups**: Create or join carpooling groups
7. **Build Network**: Send buddy requests after successful rides

## 📱 Features Overview

### Profile System
- **Personal Information**: Name, contact details, emergency contacts
- **Ride Preferences**: Music taste, smoking policy, pet policy, talkativeness level
- **Interests**: Hobbies and interests for better social matching
- **Progress Tracking**: Visual progress bar for profile completion

### Matching Algorithm
The smart matching system considers:
- **Location Proximity**: Configurable radius for start and end locations
- **Time Flexibility**: Adjustable time windows for departure
- **Personal Preferences**: Music, smoking, pets, conversation level
- **Buddy Priority**: Carpooling buddies appear first in results
- **Group Filtering**: Option to search within specific groups

### Safety Features
- **OSU Email Verification**: Ensures community membership
- **Profile Verification**: Comprehensive profile requirements
- **Ride Tracking**: Check-in/check-out system
- **Emergency Contacts**: Quick access to emergency services
- **Rating System**: Post-ride ratings for accountability
- **Issue Reporting**: Safety concern reporting system

### Group Features
- **Group Creation**: Public or private group options
- **Member Management**: Invite and manage group members
- **Schedule Sharing**: Share schedules within groups
- **Group Matching**: Priority matching within groups
- **Event Coordination**: Organize group rides to events

### Buddy System
- **Buddy Requests**: Send requests after positive ride experiences
- **Priority Matching**: Buddies appear first in search results
- **Direct Communication**: Enhanced communication with trusted partners
- **Relationship Building**: Build long-term carpooling relationships

## 🔧 Development

### Code Organization
- **Modular JavaScript**: Separate files for different functionality
- **CSS Architecture**: Organized with CSS custom properties and logical sections
- **Component-Based**: Reusable UI components and patterns
- **Error Handling**: Comprehensive error handling and user feedback

### Key JavaScript Modules
- **main.js**: Global functionality, error handling, notifications
- **auth.js**: Authentication, session management, form validation
- **dashboard.js**: Dashboard functionality, data management, UI updates

### CSS Architecture
- **Custom Properties**: CSS variables for consistent theming
- **Mobile-First**: Responsive design starting from mobile
- **Component Styles**: Modular CSS for reusable components
- **Accessibility**: Focus states, high contrast, keyboard navigation

## 🌟 Future Enhancements

### Backend Integration
- **User Authentication**: Secure backend authentication system
- **Database**: Persistent data storage for users, schedules, and matches
- **Real-time Matching**: Live matching algorithm with location services
- **Push Notifications**: Ride reminders and match notifications

### Advanced Features
- **AI-Powered Matching**: Machine learning for better compatibility
- **Route Optimization**: GPS integration for optimal route planning
- **Payment Integration**: Cost-sharing and payment processing
- **Chat System**: In-app messaging between users
- **Calendar Integration**: Sync with Google Calendar or Outlook

### Mobile App
- **Native Apps**: iOS and Android applications
- **Push Notifications**: Real-time ride updates
- **Location Services**: GPS tracking and navigation
- **Offline Support**: Basic functionality without internet

## 🤝 Contributing

This project was created as a demonstration of modern web development practices for a university carpooling application. The codebase follows best practices for:

- **Accessibility**: WCAG guidelines compliance
- **Performance**: Optimized loading and rendering
- **Security**: Input validation and XSS prevention
- **Maintainability**: Clean, documented, and modular code

## 📄 License

This project is created for educational and demonstration purposes. The design and functionality are inspired by modern carpooling applications while being specifically tailored for the Ohio State University community.

## 🎓 About

BuckeyeRide represents a comprehensive approach to solving transportation challenges within university communities. By focusing on compatibility, safety, and community building, it goes beyond simple ride-sharing to create lasting connections among Ohio State students, faculty, and staff.

The application demonstrates modern web development techniques while addressing real-world needs for sustainable, affordable, and social transportation solutions in university settings.

---

**Go Buckeyes! 🌰**
