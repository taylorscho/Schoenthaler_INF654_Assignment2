const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(addResourcesToCache([
        "/",
        "/home.html",
        "/list.html", 
        "/css/app.css",
        "/css/materialize.css",
        "/css/materialize.min.css",
        "/img/barchart.jpg",
        "/img/completion.jpg",
        "/js/app.js",
        "/js/materialize.js",
        "/js/materialize.min.js",
        "/js/script.js",
        "/manifest.json",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2"
    ])
    );
});


const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
}

const cacheFirst = async ({request, preloadResponsePromise, fallbackUrl}) => {
    const responseFromCache = await caches.match(request);
    if(responseFromCache) {
        return responseFromCache;
    }

    try{
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error){
        const fallbackResponse = await caches.match(fallbackUrl);
        if(fallbackResponse){
            return fallbackResponse;
        }
        return new Response("Network error happened", {
            status: 408, 
            headers: {"Content-Type": "text/plain"},
        });
    }
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst({request: event.request, fallbackUrl: "/img/meadow.jpg"})
    );
});

const enableNavigationPreload = async () => {
    if(self.ServiceWorkerRegistration.navigationPreload){
        await self.ServiceWorkerRegistration.navigationPreload.enable();
    }
};

self.addEventListener("activate", (event) => {
    event.waitUntil(enableNavigationPreload());
});