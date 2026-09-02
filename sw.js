/* random-lunch SW — v2026-09-02 */
const CACHE = 'rl-2026-09-02';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] 캐시 삭제:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isPage = url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  const isData = url.pathname.endsWith('.json');
  if (isPage || isData) {
    e.respondWith(
      fetch(request, { cache: 'no-store' })
        .catch(() => caches.match(request))
    );
  }
});
