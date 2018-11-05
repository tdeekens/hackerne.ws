// NOTE: Increase this version to bust all caches.
var version = 'v1.0.0';

// This installs the service worker and opens the cache
self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches
      .open(version + '-hackerne.ws')
      .then(function(cache) {
        return cache.matchAll('hacker-news.firebaseio.com');
      })
      .then(function() {
        console.log('Service Worker installed.');
      })
  );
});

// This intercepts currently intercepts any request and caches it.
self.addEventListener('fetch', function(event) {
  console.log('Service Worker intercepted: ', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function onCacheFulfill(cached) {
      var networked = fetch(event.request).then(
        function onFetchFulfill(response) {
          var cacheCopy = response.clone();

          caches
            .open(version + '-hackerne.ws')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            })
            .then(function() {
              console.log(
                'Service Worker cached response to: ',
                event.request.url
              );
            });

          return response;
        },
        function onFetchReject() {
          console.log(
            'Service Worker: failed to cache response to: ',
            event.request.url
          );
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html',
            }),
          });
        }
      );

      if (cached) {
        console.log('Service Worker had cached: ', event.request.url);
        return cached;
      } else {
        console.log('Service Worker fetches: ', event.request.url);
        return networked;
      }
    })
  );
});
