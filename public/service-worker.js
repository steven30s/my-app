// 服务工作者配置
const CACHE_NAME = 'finance-assistant-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'manifest.json',
  '/static/js/main.js',
  '/static/css/main.css',
  'pwa-192x192.png',
  'pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  
  // 不缓存API请求
  if (requestUrl.pathname.startsWith('/api/')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 对于静态资源，优先使用缓存
      if (cachedResponse && 
          (requestUrl.pathname.endsWith('.js') || 
           requestUrl.pathname.endsWith('.css') ||
           requestUrl.pathname.endsWith('.png'))) {
        return cachedResponse;
      }

      // 其他请求尝试网络获取
      return fetch(event.request).then((response) => {
        // 缓存成功的响应
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // 网络失败时返回缓存
        return cachedResponse || caches.match('/offline.html');
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});