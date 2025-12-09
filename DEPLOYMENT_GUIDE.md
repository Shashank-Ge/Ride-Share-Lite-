# RideShare Lite - Complete Deployment Guide

This guide covers all deployment options for your RideShare Lite application: **Production Builds**, **App Store Distribution**, and **Web Hosting**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Building for Production](#building-for-production)
   - [Android APK/AAB](#android-apkaab)
   - [iOS IPA](#ios-ipa)
   - [Web Build](#web-build)
4. [Publishing to App Stores](#publishing-to-app-stores)
   - [Google Play Store](#google-play-store)
   - [Apple App Store](#apple-app-store)
5. [Web Deployment](#web-deployment)
6. [Using Expo Application Services (EAS)](#using-expo-application-services-eas)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

1. **Node.js & npm** (already installed)
2. **Expo CLI** (already installed)
3. **EAS CLI** (for production builds):
   ```bash
   npm install -g eas-cli
   ```

### Required Accounts

1. **Expo Account** - [Sign up at expo.dev](https://expo.dev)
2. **Google Play Console** - For Android deployment ($25 one-time fee)
3. **Apple Developer Program** - For iOS deployment ($99/year)
4. **Web Hosting** - Vercel, Netlify, or similar (free tier available)

---

## Environment Configuration

### Step 1: Verify Your `.env` File

Ensure your `.env` file contains all production credentials:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenRouteService API
EXPO_PUBLIC_OPENROUTE_API_KEY=your-openroute-api-key

# Google Maps API
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

> [!IMPORTANT]
> Never commit `.env` to version control. It's already in `.gitignore`.

### Step 2: Update App Configuration

Edit `app.config.js` to set your app details:

```javascript
export default {
    expo: {
        name: "RideShare Lite",
        slug: "ridesharelite",
        version: "1.0.0",
        // ... rest of config
        android: {
            package: "com.ridesharelite.app", // Your unique package name
        },
        ios: {
            bundleIdentifier: "com.ridesharelite.app", // Your unique bundle ID
        }
    }
};
```

---

## Building for Production

You have two main options:
1. **EAS Build** (Recommended) - Cloud-based builds
2. **Local Builds** - Build on your machine

### Option 1: EAS Build (Recommended)

EAS (Expo Application Services) builds your app in the cloud, which is easier and doesn't require local Android Studio or Xcode setup.

#### Initial Setup

```bash
# Login to Expo
eas login

# Configure EAS for your project
eas build:configure
```

This creates an `eas.json` file with build profiles.

---

### Android APK/AAB

#### Build Android APK (For Testing)

```bash
# Build APK for internal testing/distribution
eas build --platform android --profile preview
```

This creates an `.apk` file you can install directly on Android devices.

#### Build Android App Bundle (For Play Store)

```bash
# Build AAB for Google Play Store submission
eas build --platform android --profile production
```

This creates an `.aab` file required for Play Store submission.

#### Download Your Build

After the build completes:
1. EAS will provide a download link
2. Or visit: https://expo.dev/accounts/[your-account]/projects/ridesharelite/builds

---

### iOS IPA

> [!WARNING]
> iOS builds require an Apple Developer account ($99/year) and can only be built on macOS for local builds. EAS Build works on any platform.

#### Build iOS App

```bash
# Build for App Store submission
eas build --platform ios --profile production
```

You'll need to:
1. Provide your Apple Developer credentials
2. Generate/upload signing certificates
3. EAS can handle this automatically

---

### Web Build

#### Build for Web Deployment

```bash
# Create optimized web build
npx expo export:web
```

This creates a `web-build` directory with static files ready for deployment.

---

## Publishing to App Stores

### Google Play Store

#### Step 1: Create Google Play Console Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete account setup

#### Step 2: Create App Listing
1. Click "Create app"
2. Fill in app details:
   - App name: **RideShare Lite**
   - Default language: English
   - App type: App
   - Free or paid: Free

#### Step 3: Upload Your AAB
1. Build AAB: `eas build --platform android --profile production`
2. Download the `.aab` file
3. In Play Console → Production → Create new release
4. Upload your `.aab` file
5. Fill in release notes

#### Step 4: Complete Store Listing
Required information:
- App description
- Screenshots (at least 2)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy policy URL
- Content rating questionnaire

#### Step 5: Submit for Review
1. Complete all required sections
2. Click "Submit for review"
3. Review typically takes 1-3 days

---

### Apple App Store

#### Step 1: Join Apple Developer Program
1. Go to [Apple Developer](https://developer.apple.com)
2. Enroll ($99/year)
3. Complete verification

#### Step 2: Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: **RideShare Lite**
   - Bundle ID: `com.ridesharelite.app`
   - SKU: `ridesharelite-001`

#### Step 3: Build and Upload
```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store (automated)
eas submit --platform ios
```

Or manually upload using Xcode's Application Loader.

#### Step 4: Complete App Information
Required:
- App description
- Keywords
- Screenshots (various device sizes)
- App icon
- Privacy policy
- Age rating

#### Step 5: Submit for Review
1. Complete all sections
2. Click "Submit for Review"
3. Review typically takes 1-3 days

---

## Web Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Build and Deploy
```bash
# Build web version
npx expo export:web

# Deploy to Vercel
cd web-build
vercel --prod
```

#### Step 3: Configure Domain
1. Go to Vercel dashboard
2. Add custom domain (optional)
3. Configure environment variables in Vercel settings

---

### Option 2: Netlify

#### Step 1: Build
```bash
npx expo export:web
```

#### Step 2: Deploy
1. Go to [Netlify](https://netlify.com)
2. Drag and drop `web-build` folder
3. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=web-build
   ```

---

### Option 3: GitHub Pages

#### Step 1: Update `app.config.js`
```javascript
web: {
    favicon: "./assets/favicon.png",
    bundler: "metro"
}
```

#### Step 2: Build and Deploy
```bash
# Build
npx expo export:web

# Deploy to GitHub Pages (requires gh-pages package)
npm install --save-dev gh-pages
npx gh-pages -d web-build
```

---

## Using Expo Application Services (EAS)

### Complete EAS Workflow

#### 1. Install and Login
```bash
npm install -g eas-cli
eas login
```

#### 2. Configure Project
```bash
eas build:configure
```

This creates `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 3. Build for All Platforms
```bash
# Android APK (testing)
eas build --platform android --profile preview

# Android AAB (production)
eas build --platform android --profile production

# iOS (production)
eas build --platform ios --profile production

# Build both platforms
eas build --platform all --profile production
```

#### 4. Submit to Stores
```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios

# Submit to both
eas submit --platform all
```

---

## Deployment Checklist

### Before Building

- [ ] Update version in `app.config.js`
- [ ] Verify all environment variables are set
- [ ] Test app thoroughly on Expo Go
- [ ] Update app icons and splash screen
- [ ] Prepare store assets (screenshots, descriptions)
- [ ] Create privacy policy
- [ ] Test on physical devices

### Android Deployment

- [ ] Build AAB: `eas build --platform android --profile production`
- [ ] Create Google Play Console account
- [ ] Upload AAB to Play Console
- [ ] Complete store listing
- [ ] Add screenshots and graphics
- [ ] Submit for review

### iOS Deployment

- [ ] Enroll in Apple Developer Program
- [ ] Build IPA: `eas build --platform ios --profile production`
- [ ] Create app in App Store Connect
- [ ] Upload build
- [ ] Complete app information
- [ ] Submit for review

### Web Deployment

- [ ] Build: `npx expo export:web`
- [ ] Choose hosting platform (Vercel/Netlify)
- [ ] Deploy web-build folder
- [ ] Configure custom domain (optional)
- [ ] Set up environment variables on hosting platform

---

## Updating Your App

### Version Updates

1. **Update version in `app.config.js`**:
   ```javascript
   version: "1.0.1", // Increment version
   ```

2. **For Android**, also update `versionCode`:
   ```javascript
   android: {
       versionCode: 2, // Increment for each release
   }
   ```

3. **For iOS**, update `buildNumber`:
   ```javascript
   ios: {
       buildNumber: "2", // Increment for each release
   }
   ```

### Rebuild and Resubmit
```bash
# Build new version
eas build --platform all --profile production

# Submit updates
eas submit --platform all
```

---

## Troubleshooting

### Build Fails

**Issue**: EAS build fails with dependency errors
```bash
# Clear cache and rebuild
eas build --platform android --profile production --clear-cache
```

### Environment Variables Not Working

**Issue**: API keys not accessible in production build

**Solution**: Ensure variables are in `app.config.js` under `extra`:
```javascript
extra: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
}
```

### Android Signing Issues

**Issue**: Upload failed due to signing certificate mismatch

**Solution**: Use the same keystore for all builds. EAS handles this automatically.

### iOS Provisioning Errors

**Issue**: Provisioning profile errors

**Solution**: Let EAS manage certificates:
```bash
eas build --platform ios --profile production --clear-credentials
```

### Web Build Not Loading

**Issue**: White screen on deployed web app

**Solution**: Check browser console for errors. Ensure all assets are correctly referenced.

---

## Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| **EAS Build** | Free tier: 30 builds/month | Paid: $29/month for unlimited |
| **Google Play** | $25 one-time | Required for Android |
| **Apple Developer** | $99/year | Required for iOS |
| **Web Hosting** | Free (Vercel/Netlify) | Paid plans for custom domains |

---

## Quick Reference Commands

```bash
# Development
npx expo start                    # Start dev server
npx expo start --clear            # Clear cache and start

# Building (EAS)
eas build --platform android --profile preview     # Android APK
eas build --platform android --profile production  # Android AAB
eas build --platform ios --profile production      # iOS IPA
eas build --platform all --profile production      # Both platforms

# Web
npx expo export:web              # Build for web
vercel --prod                    # Deploy to Vercel
netlify deploy --prod            # Deploy to Netlify

# Submission
eas submit --platform android    # Submit to Play Store
eas submit --platform ios        # Submit to App Store
eas submit --platform all        # Submit to both stores
```

---

## Next Steps

1. **Choose your deployment target** (Android, iOS, or Web)
2. **Set up required accounts** (Expo, Play Console, Apple Developer)
3. **Build your app** using EAS Build
4. **Test the build** on physical devices
5. **Submit to stores** or deploy to web
6. **Monitor reviews** and user feedback

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Ready to deploy? Start with EAS Build!** 🚀

```bash
eas login
eas build:configure
eas build --platform android --profile preview
```
