var search = window.location.search;
var id = parseInt(search.replace('?id=', ''));

var db = null;
var request = window.indexedDB.open("deliverage", 1);
request.onsuccess = function (e) {
  console.log("onsuccess");
  console.log("db opened:", e);
  db = e.target.result;
  console.log("db:", db);

  var getOrder = function (key, onsuccess) {
    db.transaction("orders").objectStore("orders").get(parseInt(key)).onsuccess = function (event) {
      onsuccess(event.target.result);
    };
  };

  var renderOrder = function (order) {

    var titleEl = $('[data-region="title"]');
    var titleCompiled = _.template($('#titleTemplate').html())({client: order.client});

    titleEl.html(titleCompiled);

    var subtitleEl = $('[data-region="subtitle"]');
    var subtitleCompiled = _.template($('#subtitleTemplate').html())({address: order.address, time: order.time});

    subtitleEl.html(subtitleCompiled);

    var listEl = $('[data-region="items"]');
    var compiled = _.template($('#itemTemplate').html());
    var html = "";

    order.items.forEach(function (order) {
      html += compiled(order);
    });

    listEl.html(html);
  };

  $(document).ready(function () {
    getOrder(id, renderOrder);
  });
};