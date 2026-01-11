# Sign Sync – Accessible Communicator

A static web app for accessible communication featuring:
- Quick phrase tiles with text-to-speech
- Custom phrases (save and speak)
- Live captions (Web Speech API speech-to-text)
- Sign recognition demo (MediaPipe Hands)
- Environment compatibility tests

## Prerequisites
- Modern Chrome/Edge (recommended). Safari has limited STT support.
- HTTPS or http://localhost for camera (secure context requirement).

## Local Development

Option A: Use live-server (no build step)
1) Install Node.js >= 18
2) Install dev server
```bash
npm i -D live-server
```
3) Start server
```bash
npx live-server --open=index.html --port=5500
```

Option B: Any static server
Serve this folder as static content over HTTPS or on http://localhost. Examples:
- VS Code Live Server extension
- `python -m http.server` (camera may not work without HTTPS)

## Browser Permissions
- Camera (Sign to Speech): grant access when prompted
- Microphone (Live Captions): grant access when prompted
- If blocked: click the lock icon in the address bar → allow permissions → reload

## Features Overview
- Dashboard: quick tiles and conversation log
- Custom Phrase: enter, speak, and save phrases (persisted in localStorage)
- Live Captions: real-time speech-to-text; pick language; captions shown on page
- Sign to Speech: webcam + hand landmarks for a simple demo (thumb up/down, open palm)
- Environment Tests: checks APIs and basic permissions availability

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
