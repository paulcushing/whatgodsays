const cacheName = 'v3'

const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(cacheName);
  await cache.put(e.request, resClone);
  return res;
};

const fetchEvent = () => {
  self.addEventListener('fetch', (e) => {
    // only intercept GET requests — Cache.put throws for POST/PUT/etc.,
    // which would otherwise break form submissions like /api/contact
    if (e.request.method !== 'GET') return;
    // skip cache for Vercel files
    if (e.request.url.includes('_vercel')) return;
    // never cache API calls (dynamic, and may be non-idempotent)
    if (new URL(e.request.url).pathname.startsWith('/api/')) return;
    e.respondWith(
      cacheClone(e)
        .catch(() => caches.match(e.request))
        .then((res) => res)
    );
  });
};

fetchEvent();