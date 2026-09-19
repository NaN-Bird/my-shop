/* ===== SERVICE WORKER для Пташка ===== */

const CACHE_NAME = 'ptashka-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/site.webmanifest',
];

// Встановлення
self.addEventListener('install', (event) => {
    console.log('SW: Встановлення...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Кешування файлів...');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Активація
self.addEventListener('activate', (event) => {
    console.log('SW: Активація...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Видалення старого кешу:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch — мережа спочатку, кеш як fallback
self.addEventListener('fetch', (event) => {
    // Пропускаємо API-запити (не кешуємо)
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('/upload')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Кешуємо тільки успішні GET-запити
                if (event.request.method === 'GET' && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Якщо мережа недоступна — беремо з кешу
                return caches.match(event.request);
            })
    );
});