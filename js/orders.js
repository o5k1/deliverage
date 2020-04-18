var db = null;
var request = window.indexedDB.open("deliverage", 1);
request.onsuccess = function (e) {
  console.log("onsuccess");
  console.log("db opened:", e);
  db = e.target.result;
  console.log("db:", db);

  var getOrders = function (onsuccess) {
    var orders = [];

    db.transaction("orders").objectStore("orders").openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var order = cursor.value;
        order.key = cursor.primaryKey;
        orders.push(order);
        cursor.continue();
      } else {
        onsuccess(orders);
      }
    };
  };

  var renderOrders = function (orders) {
    var listEl = $('[data-region="body"]');
    var compiled = _.template($('#orderTemplate').html());
    var html = "";

    orders.forEach(function (order) {
      html += compiled(order);
    });

    listEl.html(html);
  };

  $(document).ready(function () {
    getOrders(renderOrders);
  });
};