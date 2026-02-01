# Sign Sync – Accessible Communicator 🤝

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://bhoomikadevraj.github.io/pcl-project/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A free, web-based accessible communication tool featuring speech recognition, sign language detection, and customizable phrases.

## ✨ Features

- 🗣️ **Text-to-Speech** - Quick phrase tiles with natural voice output
- 🔐 **User Authentication** - Secure accounts powered by Supabase
- 💾 **Custom Phrases** - Save and sync your favorite phrases (requires login)
- 🎙️ **Live Captions** - Real-time speech-to-text with multiple languages
- 👋 **Sign Recognition** - Basic hand gesture detection using MediaPipe
- ♿ **Fully Accessible** - WCAG compliant, keyboard navigation, screen reader friendly
- 📱 **Progressive Web App** - Install on any device, works offline
- 🔒 **Privacy-First** - All processing happens locally, no tracking

## 🚀 Quick Start

### Live Demo
Visit **[https://bhoomikadevraj.github.io/pcl-project/](https://bhoomikadevraj.github.io/pcl-project/)**

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/bhoomikadevraj/pcl-project.git
cd pcl-project

# 2. Install dependencies
npm install

# 3. Configure Supabase (see SUPABASE_SETUP.md)
# Update js/supabase-config.js with your credentials

# 4. Start development server
npm run dev
# Opens at http://localhost:5500
```

## Browser Permissions
- Camera (Sign to Speech): grant access when prompted
- Microphone (Live Captions): grant access when prompted
- If blocked: click the lock icon in the address bar → allow permissions → reload

## Features Overview
- **Dashboard**: quick tiles and conversation log
- **Custom Phrase**: enter, speak, and save phrases (requires login, syncs to database)
- **Live Captions**: real-time speech-to-text; pick language; captions shown on page
- **Sign to Speech**: webcam + hand landmarks for a simple demo (thumb up/down, open palm)
- **Environment Tests**: checks APIs and basic permissions availability
- **Authentication**: Supabase-powered user accounts

## User Authentication
- Sign up with email and password
- Sign in to access custom phrases
- Custom phrases are private and sync across devices
- Sign out anytime from the top right

## Database Structure
Custom phrases are stored in Supabase with:
- User-specific access (RLS policies)
- Real-time synchronization
- Persistent storage
- Secure and private

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for schema details.

## Deployment (GitHub Pages)
- Workflow in `.github/workflows/static.yml` publishes the repository root
- Ensure Pages settings use "GitHub Actions" as the source

## Known Notes / Tips
- Camera requires HTTPS or http://localhost: use a local dev server
- STT availability varies by browser and OS
- If video shows black screen: verify permissions and that another app isn't using the camera

## Roadmap (suggested)
- Stop camera and STT automatically when navigating away (cleanup on view change)
- Accessibility improvements (aria-live for captions, keyboard-friendly nav tiles)
- Persist STT language selection across sessions
- Add ESLint/Prettier and basic CI checks
- Optional PWA: add manifest and service worker for installability
