# RideShare Lite - Quick Start Guide

## 🚀 Running the App

### On Android
1. Make sure Expo server is running: `npx expo start`
2. Press `a` in the terminal OR scan QR code with Expo Go app
3. App should now load past the splash screen to the Landing page

### On Web
1. In the Expo terminal, press `w` OR run:
   ```bash
   npx expo start --web
   ```
2. Browser will open automatically at `http://localhost:8081`

### On iOS (Mac only)
1. Press `i` in the terminal
2. Requires Xcode to be installed

## 🔧 What Was Fixed

### Issue 1: App Stuck on Splash Screen
**Problem**: App was hanging indefinitely on "RideShare Lite" splash screen

**Solution**: Added 2-second timeout to AuthContext initialization
- If Supabase credentials are not configured, app proceeds to Landing page after 2 seconds
- Added error handling for Supabase connection failures
- App now works WITHOUT Supabase credentials configured

### Issue 2: Web Support
**Problem**: Web dependencies were missing

**Solution**: Installed required packages:
- `react-dom` - React for web
- `react-native-web` - React Native components for web
- `@expo/metro-runtime` - Expo web runtime

## 📱 Expected Behavior

### Without Supabase Credentials (Current State)
1. **Splash Screen** (2 seconds) → Shows "RideShare Lite" with loading spinner
2. **Landing Page** → Shows welcome screen with "Create Account" and "Login" buttons
3. **Navigation** → Can navigate to Login/Signup screens
4. **Authentication** → Will show error when trying to login/signup (Supabase not configured)

### With Supabase Credentials (After Configuration)
1. **Splash Screen** → Checks for existing session
2. **Landing Page** (if not logged in) → Full auth flow works
3. **Main App** (if logged in) → Shows 5 tabs: Home, Search, Publish, MyRides, Profile

## 🔑 Adding Supabase Credentials (Optional)

To enable authentication, create a `.env` file:

```bash
# In the project root: e:\PROJECTS\RideShare Lite\RSL\RideShareLite
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get credentials from: https://app.supabase.com/project/_/settings/api

After adding credentials:
1. Stop the Expo server (Ctrl+C)
2. Restart: `npx expo start -c` (clear cache)

## 🎯 Testing Checklist

### ✅ Android
- [ ] App loads past splash screen
- [ ] Landing page appears
- [ ] Can navigate to Login screen
- [ ] Can navigate to Signup screen
- [ ] Back button works

### ✅ Web
- [ ] Press `w` in Expo terminal
- [ ] Browser opens automatically
- [ ] Landing page displays correctly
- [ ] All navigation works
- [ ] Responsive design works

### ✅ Navigation Flow
- [ ] Splash → Landing (2 seconds)
- [ ] Landing → Login (tap "Login")
- [ ] Landing → Signup (tap "Create Account")
- [ ] Login/Signup → Back to Landing (back button)

## 🐛 Troubleshooting

### App Still Stuck on Splash
1. Stop Expo server (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Reload app: Press `r` in terminal or shake device

### Web Not Working
1. Make sure you pressed `w` in the Expo terminal
2. Or run: `npx expo start --web`
3. Check browser console for errors (F12)

### "Network Error" on Login/Signup
This is expected if Supabase credentials are not configured. Add `.env` file with credentials to fix.

## 📝 Current App Status

✅ **Working**:
- Project structure and navigation
- All 9 screens created
- Splash screen with timeout
- Landing, Login, Signup screens
- Main app tabs (Home, Search, Publish, MyRides, Profile)
- Web support enabled
- Android support working

⏳ **Not Yet Implemented**:
- Actual authentication (needs Supabase credentials)
- Search ride functionality
- Publish ride functionality
- Map integration
- Payment integration
- Chat feature

## 🎨 Next Steps

1. **Test the app** on Android and Web
2. **Add Supabase credentials** (optional, for auth to work)
3. **Start implementing core features**:
   - Search ride screen
   - Publish ride flow
   - Ride details
   - Booking system

## 💡 Quick Commands

```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start -c

# Open on Android
Press 'a' in terminal

# Open on Web
Press 'w' in terminal

# Reload app
Press 'r' in terminal

# Open debugger
Press 'j' in terminal
```

---

**App is now ready for development!** 🎉
