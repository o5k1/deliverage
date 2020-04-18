var db = null;
var map = null;
getMap = function () {
  map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'Ar-9CgCbalbkrLCgfcSeABL5BqV6kp-nYjUpWBEUwTjjzFbWT14ZWT4Wux3L7dZj',
  });

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

    $(document).ready(function () {

      getOrders(function (orders) {

        orders.forEach(function (order) {
          var address = order.address;
          var center = new Microsoft.Maps.Location(address.location.latitude, address.location.longitude);
          //Create custom Pushpin
          var pin = new Microsoft.Maps.Pushpin(center, {
            title: order.client,
            subTitle: address.formattedSuggestion
          });
          //Add the pushpin to the map
          map.entities.push(pin);
        })
      });
    });
  };
};
