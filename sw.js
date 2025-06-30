// Nama cache - Ganti versi jika ada perubahan besar pada file aplikasi
const CACHE_NAME = 'dokumentasi-kinerja-v7;

// Daftar file yang akan di-cache. Gunakan path relatif.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm'
];

// Event 'install': dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstal...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching file aplikasi...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Gagal cache file saat instalasi.', err);
      })
  );
});

// Event 'activate': membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  console.log('Service Worker: Mengaktifkan...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event 'fetch': menangani semua permintaan jaringan dengan strategi "Cache First"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan dari cache. Jika tidak, ambil dari jaringan.
        return response || fetch(event.request);
      })
  );
});
