// Nama cache
const CACHE_NAME = 'dokumentasi-kinerja-v2'; // Versi baru
// Daftar file yang akan di-cache
const urlsToCache = [
  './', // Ini mengacu pada index.html
  './index.html',
  './manifest.json',
  './icon-192x192.png', // Jangan lupa tambahkan ikon ini
  './icon-512x512.png', // Jangan lupa tambahkan ikon ini
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm' // Penting untuk sql.js
];

// Event 'install': dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka, file sedang ditambahkan');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': dijalankan setiap kali ada permintaan dari aplikasi
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika permintaan ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, coba ambil dari jaringan
        return fetch(event.request);
      }
    )
  );
});

// Event 'activate': membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
