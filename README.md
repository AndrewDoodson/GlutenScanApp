# GlutenScan

An Android app that helps people following a gluten free diet quickly check whether a grocery product contains gluten by scanning its barcode.

## What it does

1. User opens the app and points their camera at a product barcode
2. The app sends the barcode to the GlutenScan backend API
3. The backend looks up the product and checks for gluten ingredients
4. The app displays a colour coded result:
   - 🟢 **Green** — No gluten ingredients detected
   - 🔴 **Red** — Contains gluten
   - 🟡 **Yellow** — Unknown or product not found
5. The result is saved to a local scan history (last 10 scans)

## Screenshots

_Add screenshots here once available_

## Target market

New Zealand grocery products.

## Tech stack

- **Framework:** React Native via Expo
- **Language:** TypeScript
- **Barcode scanning:** expo-camera
- **Local storage:** AsyncStorage (scan history)
- **Navigation:** React Navigation

## Third party services

- **GlutenScan API** — the backend that looks up products and detects gluten (github.com/AndrewDoodson/glutenscan-api)
- **Open Food Facts** — the product database used by the backend
- **Expo / EAS Build** — used to build and compile the Android APK
- **Railway** — where the backend API is hosted

## Requirements to run

- An active internet connection (WiFi or mobile data)
- Android 6.0 or newer
- Camera permission (required for barcode scanning)
- The GlutenScan API must be running and reachable

## Running locally

Make sure you have Node.js and the Expo CLI installed, then:
```bash
git clone https://github.com/AndrewDoodson/GlutenScanApp.git
cd GlutenScanApp
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your Android phone.

## Building an APK
```bash
eas build --platform android --profile preview
```

This builds the app in the cloud via EAS Build and provides a download link for the APK file.

## Project structure
```
src/
├── screens/
│   ├── ScanScreen.tsx        # Camera and barcode scanning
│   ├── ResultScreen.tsx      # Colour coded result display
│   └── HistoryScreen.tsx     # Last 10 scans
├── services/
│   ├── api.ts                # Backend API calls
│   └── history.ts            # AsyncStorage scan history
└── navigation/
    └── AppNavigator.tsx      # React Navigation stack
```

## Important disclaimer

This app is for informational purposes only. Always verify ingredients on the physical product label. The app does not detect cross contamination warnings such as "may contain wheat" and results depend on the accuracy of data in the Open Food Facts database.

## Known limitations

- Not every New Zealand product is in the Open Food Facts database — smaller local brands may return Unknown Product
- Cross contamination warnings are not detected
- Requires an internet connection — does not work offline
- Results are only as accurate as the Open Food Facts community data

## Future improvements

- Submit to Google Play Store
- Detect cross contamination warnings
- Build a local NZ product database to supplement Open Food Facts
- Allow users to report incorrect results
- Offline mode with cached products
