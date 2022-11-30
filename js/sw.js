self.addEventListener("install", function(event){
    console.log(`SW: Event fired ${event.type}`);
});

self.addEventListener("activate", function(event){
    console.log(`SW: Event fired ${event.type}`);
});

self.addEventListener("fetch", function(event){
    console.log(`SW: Fetching ${event.request.url}`);

    event.respondWith(fetch(event.request));
});