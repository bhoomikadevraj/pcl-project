// Service Worker for offline support
const CACHE_NAME = 'sign-sync-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/app.js',
  '/js/utils.js',
  '/js/navigation.js',
  '/js/tiles.js',
  '/js/custom-phrase.js',
  '/js/speech-recognition.js',
  '/js/sign-recognition.js',
  '/js/auth-ui.js',
  '/js/environment-tests.js',
  '/js/cleanup-observer.js',
  '/components/header.html',
  '/components/sidebar.html',
  '/components/auth.html',
  '/components/views/dashboard.html',
  '/components/views/custom-phrase.html',
  '/components/views/live-captions.html',
  '/components/views/sign-recognition.html',
  '/components/views/environment-tests.html',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (CDN scripts, Supabase)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Don't cache if not a success
          if (!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }

          // Clone and cache the response
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        });
      })
      .catch(() => {
        // Offline fallback - could return a custom offline page
        return caches.match('/index.html');
      })
  );
});
