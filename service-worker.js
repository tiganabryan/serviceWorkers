self.addEventListener("install", event => {
	if (!("caches" in self)) return

	event.waitUntil(
		/* event.waitUntil is useful when you want to wait for a 
        promise to resolve before stopping the install. */
		caches.open("version1").then(cache => {
			return cache.addAll([
				"./index.html",
				"./styles.css",
				"./offline.html",
			])
		})
	)
	self.skipWaiting()
	console.log("updated service worker installed:", event)
})

self.addEventListener("activate", event => {
	console.log("service worker activated:", event)
})

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
// whe there's a fetch request I want to check if the user is offline. if they're offline, I will hand them the offline page.
// otherwise, I'll hand them the online version.

/* the caching system is what makes my site available offline!
I simply save the assets to the cache beforehand. */
