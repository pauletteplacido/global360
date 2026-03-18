self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("global360").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/css/styles.css",
        "/js/app.js"
      ]);
    })
  );
});