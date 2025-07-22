# BuckeyeRide Setup Guide

## Quick Start

### 1. Start the Local Development Server

```bash
# Using Node.js (recommended)
npm start
# or
node server.js

# The server will start on http://localhost:3000
```

### 2. Access the Website

Open your browser and navigate to:
- **http://localhost:3000** - Main website
- **http://localhost:3000/login** - Login page
- **http://localhost:3000/signup** - Signup page

### 3. Firebase Authentication Setup

The Firebase configuration is already set up with your provided credentials. However, you may need to:

1. **Enable Authentication Methods** in Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `buckeyeride-8ca52`
   - Go to **Authentication > Sign-in method**
   - Enable **Google** as a sign-in provider
   - Add authorized domains:
     - `localhost`
     - `127.0.0.1`

2. **Configure Authorized Domains**:
   - In Firebase Console, go to **Authentication > Settings**
   - Add `localhost` and `127.0.0.1` to authorized domains

### 4. Google Maps API Setup

The Google Maps API key is already integrated. Ensure it's properly configured:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable the **Maps JavaScript API** and **Places API**
4. Add HTTP referrers:
   - `http://localhost:3000/*`
   - `http://127.0.0.1:3000/*`

## Troubleshooting

### Security Error / Bad Gateway
If you see "security error" or "bad gateway" messages:
1. **Use the local server** - Don't open files directly with `file://`
2. **Check HTTPS requirements** - Firebase Auth requires HTTPS or localhost
3. **Clear browser cache** - Sometimes old cached files cause issues

### Firebase Authentication Issues
- **Popup blocked**: Allow popups for localhost:3000
- **Unauthorized domain**: Add localhost to Firebase authorized domains
- **Network errors**: Check internet connection and Firebase console settings

### Google Maps Not Loading
- **API key issues**: Verify the API key is correct in js/main.js
- **HTTPS requirement**: Maps API requires HTTPS or localhost
- **Billing enabled**: Ensure billing is enabled for your Google Cloud project

## Development Commands

```bash
# Start development server
npm start

# Alternative commands
npm run dev
npm run serve
```

## Project Structure

```
buckeyeride/
├── index.html          # Homepage
├── login.html          # Login page
├── signup.html         # Signup page
├── dashboard/          # Dashboard pages
├── css/               # Stylesheets
├── js/                # JavaScript files
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js            # Authentication logic
│   └── main.js            # Main application logic
├── server.js          # Local development server
├── package.json       # Project configuration
└── SETUP.md          # This file
```

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Security Notes

- Always use HTTPS in production
- Never commit API keys to version control
- Regularly update Firebase security rules
- Use environment variables for sensitive configuration
