// when the service worker's global scope detects a new service worker being installed, add the assets we want to be available offline to the cache
self.addEventListener("install", event => {
	if (!("caches" in self)) return

	event.waitUntil(
		/* event.waitUntil is useful when you want to wait for a 
        promise to resolve before stopping the install. */
		caches.open("version2").then(
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
	console.log("now activating service worker")
	const current_cache = "version2"
	event.waitUntil(
		caches.keys().then(cacheKeys => {
			/* caches lets you access the cache in the browser.
			.keys() returns a promise that resolves to an array 
			containing strings corresponding to all of the named 
			Cache objects tracked by the CacheStorage object in 
			the order they were created */
			return Promise.all(
				// Promise.all() resolves to an array of all pending promises as one promise together.
				cacheKeys.map(cacheKey => {
					if (cacheKey !== current_cache) {
						console.log("deleting cache: ", cacheKey)
						return caches
							.delete(cacheKey)
							.then(response =>
								console.log("was cache deleted", response)
							)
						// .then(
						// 	response => {
						// 		console.log(response)
						// 		return response
						// 	},
						// 	err => {
						// 		console.log("error deleting cache:", err)
						// 	}
						// )
					}
				})
			)
		})
	)
})

const returnOfflineVersion = event => {
	return caches.match(new Request("/offline.html"))
}

const pullFromCache = event => {
	return caches.match(event.request).then(response => {
		return (
			response ||
			fetch(event.request).then(response => {
				console.log("fetched from network instead of cache")
				return caches.open("version2").then(cache => {
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
}

// when the service worker detects a fetch event, intercept it and respond with cached assets instead.
// if asset isn't cached, only then do we fetch it.
self.addEventListener("fetch", event => {
	if (!navigator.onLine && event.request.url.indexOf("") !== -1) {
		// `indexOf` returns the first index at which a given element can be found in the array, or -1 if not present.
		// empty string is the landing page route.
		/* onLine isn't a reliable way to check if a user has internet because if they have a connection without 
		internet, it will still return true. but in this case, it's used to get the offline view displaying quickly. */
		event.respondWith(returnOfflineVersion(event))
	} else {
		event.respondWith(pullFromCache(event))
	}
})

/* the caching system is what makes my site available offline
I simply save the assets to the cache beforehand. */
