// Ganti versi ini SETIAP KALI Anda meng-upload perubahan baru ke index.html atau file lain.
const CACHE_NAME = 'dokumentasi-kinerja-v11';

// Daftar file inti aplikasi yang harus selalu tersedia offline.
const urlsToCache = [
  './', // Ini sangat penting, mewakili URL dasar.
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm'
];

// Event 'install': Menyimpan file aplikasi ke dalam cache.
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstal versi baru...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Menambahkan file aplikasi ke cache...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Memaksa Service Worker yang sedang menunggu untuk menjadi yang aktif.
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Gagal cache file saat instalasi.', err);
      })
  );
});

// Event 'activate': Membersihkan cache lama.
self.addEventListener('activate', event => {
  console.log('Service Worker: Mengaktifkan...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Jika nama cache tidak sama dengan yang sekarang, hapus.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // Memberi tahu Service Worker untuk mengambil kontrol semua halaman dengan segera.
        return self.clients.claim();
      })
    })
  );
});

// Event 'fetch': Menyajikan konten dari cache saat offline.
self.addEventListener('fetch', event => {
  // Hanya proses permintaan GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Jika ada di cache, sajikan dari cache.
        if (response) {
          // console.log(`Service Worker: Menyajikan dari cache: ${event.request.url}`);
          return response;
        }

        // Jika tidak ada di cache, coba ambil dari jaringan.
        // console.log(`Service Worker: Mengambil dari jaringan: ${event.request.url}`);
        return fetch(event.request).then(networkResponse => {
            // (Opsional) Jika Anda ingin cache sumber daya baru secara dinamis
            // cache.put(event.request, networkResponse.clone());
            return networkResponse;
        }).catch(error => {
            console.error('Service Worker: Gagal mengambil dari jaringan.', error);
            // Anda bisa menyediakan halaman fallback offline di sini jika diperlukan
        });
      });
    })
  );
});
