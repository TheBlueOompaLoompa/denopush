self.addEventListener("push", async (event) => {
  const { title, body } = await event.data.json();
  self.registration.showNotification(title, {
    body,
  });

  console.log('lo')

  const request = self.indexedDB.open("NotificationDB", 1);
  console.log(request)

  let countStore = null;

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db;
  }

  request.onsuccess = (ev) => {
    const db = ev.target.result;
    

    console.log(db)
  }

  let count = self.window.localStorage.getItem('count') ? parseInt(self.window.localStorage.getItem('count')) : 10;
  
  if(count <= 0) {
    count = 10;
    self.window.localStorage.setItem('count', count);
  }
  
  self.navigator.setAppBadge(count)
  count -= 1;
});