/* CEMAN — Service Worker GitHub Pages */
const CACHE = 'ceman-v4';
const BASE = 'https://derciliopereira-commits.github.io/ceman-app';
const FILES = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png'
];

self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(
    caches.match(evt.request).then(function(cached) {
      return cached || fetch(evt.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(evt.request, clone);
          });
        }
        return response;
      });
    }).catch(function() {
      return caches.match(BASE + '/index.html');
    })
  );
});
