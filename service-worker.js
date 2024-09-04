// when the service worker's global scope detects a new service worker being installed, add the assets we want to be available offline to the cache
self.addEventListener("install", event => {
	if (!("caches" in self)) return

	event.waitUntil(
		/* event.waitUntil is useful when you want to wait for a 
        promise to resolve before stopping the install. */
		caches.open("version1").then(
			cache => {
				return cache.addAll([
					"./index.html",
					"./styles.css",
					"./offline.html",
				])
			},
			err => {
				console.log("error adding to cache:", err)
			}
		)
	)
	self.skipWaiting()
	console.log("updated service worker installed:", event)
})

self.addEventListener("activate", event => {
	console.log("service worker activated:", event)
})

// when the service worker detects a fetch event, interceept it and return cached assets instead.
// if asset isn't cached, only then do we fetch it.
self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return (
				response ||
				fetch(event.request).then(async response => {
					console.log("fetched from network instead of cache")
					return caches.open("version1").then(cache => {
						cache.put(event.request, response.clone())
						/* response is being consumed (read) here, 
                            and will be deleted from memory unless
                            we create a clone of it. on the next 
                            line, we're returning the clone. the 
                            original was deleted when we passed 
                            it into caches.put() */
						return response
					})
				})
			)
		})
	)
})

/* the caching system is what makes my site available offline
I simply save the assets to the cache beforehand. */
