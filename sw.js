self.addEventListener("install", (event) => {
  // создаём пустой кеш, но не грузим сразу все картинки
  event.waitUntil(
    caches.open("static-cache")
  );
});

// универсальный обработчик запросов
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // игнорируем chrome-extension:// и другие неподдерживаемые схемы
  if (!request.url.startsWith("http")) {
    return;
  }

  // кэшируем только нужные типы ресурсов
  if (["image", "style", "script"].includes(request.destination)) {
    event.respondWith(
      caches.open(`${request.destination}-cache`).then((cache) =>
        cache.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((networkResponse) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            })
          );
        })
      )
    );
  }
});
