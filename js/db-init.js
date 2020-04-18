// Let us open our database
var request = window.indexedDB.open("deliverage", 1);
request.onerror = function (error) {
  console.log("[ERROR] open db:", error);
};
request.onupgradeneeded = function (e) {
  // SOLO QUA POSSO CAMBIARE STRUTTURA DB TRA VERSIONI DIVERSE

  console.log("onupgradeneeded");
  var db = e.target.result;
  console.log("db:", db);

  // Create an objectStore for this database
  var menuItemStore = db.createObjectStore("menu-items", {autoIncrement: true});

  // Create an index to search menu items by name. We want to ensure that
  // no two items have the same name, so use a unique index.
  menuItemStore.createIndex("name", "name", {unique: true});

  // Use transaction oncomplete to make sure the objectStore creation is
  // finished before adding data into it.
  menuItemStore.transaction.oncomplete = function (event) {
    // Store values in the newly created objectStore.
    var store = db.transaction("menu-items", "readwrite").objectStore("menu-items");
    var items = [
      {name: "Hamburger"},
      {name: "Sandwich"},
      {name: "Caesar Salad"},
      {name: "Poke"},
    ];
    items.forEach(function (item) {
      store.add(item);
    });
  };

  // Create an objectStore for this database
  var orderStore = db.createObjectStore("orders", {autoIncrement: true});

  // Create an index to search menu items by name. We want to ensure that
  // no two items have the same name, so use a unique index.
  orderStore.createIndex("client", "client", {unique: true});
  orderStore.createIndex("time", "time", {unique: true});

};
request.onsuccess = function (e) {
  console.log("onsuccess");
  console.log("db opened:", e);
  var db = e.target.result;
  console.log("db:", db);
};

//TODO calcola distanza tra address e posizione corrente
//TODO salva ordine
//TODO mostra avviso se due ordini pending hanno address con distanza < che tornare ad home @https://docs.microsoft.com/en-us/bingmaps/v8-web-control/map-control-concepts/spatial-math-module-examples/basic-core-spatial-math-example