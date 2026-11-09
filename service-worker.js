const CACHE = 'winter-countdown-v3';
const ASSETS = ['./', './index.html', './style.css?v=2', './app.js?v=2', './countdown.js', './favicon.svg'];
const assetUrls = new Set(ASSETS.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(
    ASSETS.map(path => new Request(path, { cache: 'reload' }))
  )));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('winter-countdown-') && key !== CACHE)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !assetUrls.has(event.request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
