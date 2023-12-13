const version = "1.0";
// Choose a cache name
const cacheNamePrefix = "cache-swarzedz-meteo";
const cacheName = `${cacheNamePrefix}-v${version}`;
// List the files to precache
const precacheResources = [
    "/",
    "/static/css/style.css",
    "/static/js/index.js",
    "/static/js/translate.js",
    "/static/js/error.js",
    "/static/js/theme.js",
    "/static/img/icon_animated.svg",
    "/manifest.json",
    "/manifest_en.json",
    "/static/img/icons/icon_x192.png",
    "/static/img/icon.ico",
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener("install", (event) => {
    console.log("Service worker install event!");

    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key != cacheName && key.startsWith(cacheNamePrefix)) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service worker activate event!");
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
    console.log("Fetch intercepted for:", event.request.url);

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
