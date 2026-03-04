self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("images-cache").then((cache) => {
      // можно заранее закэшировать картинки
      return cache.addAll([
        './page/Devel/img/Arrow.svg',
        './page/Donate/img',
        './page/Error/img/back.webp',
        './page/Error/img/backMob.webp',
        './page/Footer/img/ds.svg',
        './page/Footer/img/ins.svg',
        './page/Footer/img/tt.svg',
        './page/Footer/img/yt.svg',
        './page/Header/img/logo.png',
        './page/Header/img/logo.svg',
        './page/Header/img/logoMob.svg',
        './page/Home/img/back.webp',
        './page/Home/img/brain.webp',
        './page/Home/img/effects.webp',
        './page/Home/img/elementsBrain.webp',
        './page/Home/img/end.webp',
        './page/Home/img/endZoom.webp',
        './page/Home/img/flag-sprite.webp',
        './page/Home/img/flag.png',
        './page/Home/img/flag.webp',
        './page/Home/img/icon.webp',
        './page/Home/img/next.webp',
        './page/Home/img/nextZoom.webp',
        './page/Home/img/obs.webp',
        './page/Home/img/obsBlur.webp',
        './page/Home/img/Partners.webp',
        './page/Home/img/partnersMob.webp',
        './page/Home/img/roadMap.webp',
        './page/Home/img/roadMapMob.png',
        './page/Home/img/Star.svg',
        './page/Home/img/start.webp',
        './page/Home/img/startZoom.webp',
        './page/Home/img/sue.webp',
        './page/Home/img/sueBlur.webp',
        './page/Home/img/sword.webp',
        './page/Home/img/Union.webp',
        './page/Offer/img/',
        './page/Profile/img/backMob.webp',
        './page/Profile/img/icon-id.svg',
        './page/Profile/img/icon-info.svg',
        './page/Profile/img/icon-location.jpg',
        './page/Profile/img/icon-location.svg',
        './page/Profile/img/icon-role.svg',
        './page/Profile/img/userBackground.webp',
        './page/Work/img/back.webp',
        './page/Work/img/gord.png',
        './page/Work/img/harli.png',
        './page/Work/img/kagura.jpg',
        './page/Work/img/leyla.png',
        './page/Work/img/mia.png',
        './page/Work/img/reg.svg',
        './page/Work/img/sora.webp',
        './page/Work/img/tourn.png',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',
        // './page',

      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    event.respondWith(
      caches.open("images-cache").then((cache) =>
        cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          );
        })
      )
    );
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.destination === "style") {
    event.respondWith(
      caches.open("styles-cache").then((cache) =>
        cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          );
        })
      )
    );
  }
});

