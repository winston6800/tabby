# Tabby Chrome Extension

## Content Security Policy (CSP) Settings

The extension's manifest.json includes a Content Security Policy that allows loading Firebase-related scripts. Here's what each domain is used for:

- `'self'`: Allows loading scripts from the extension's own files
- `https://www.gstatic.com/`: Required for Firebase core scripts
- `https://*.firebaseio.com`: Required for Firebase Realtime Database
- `https://www.googleapis.com`: Required for Firebase Authentication

These settings are necessary for the Firebase integration to work properly in the Chrome extension.

This folder contains the code for the Tabby Chrome extension. The extension provides a lightweight task view, stopwatch, and notecard for focused work sessions on nodes from the main app. 