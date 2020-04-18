var state = {
  client: '',
  address: null,
  time: null,
  items: []
};

var orders = [];

var renderCloser = function (closer) {
  var closerEl = $('[data-region="closer"]');
  var compiled = _.template($('#closerTemplate').html())(closer);

  closerEl.html(compiled);
};

onMapLoaded = function () {
  var selectedSuggestion = function (result) {
    state.address = result;
    Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
      var closer = null;
      orders.forEach(function (order) {
        var address = order.address;
        var distance = Microsoft.Maps.SpatialMath.getDistanceTo(address.location, result.location, Microsoft.Maps.SpatialMath.DistanceUnits.Kilometers);
        if (closer === null || distance < closer.distance) {
          closer = {order: order, distance: Math.round(distance)};
        }
      });
      if (closer) {
        renderCloser(closer);
      }
    });
  };

  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
    callback: function () {
      var manager = new Microsoft.Maps.AutosuggestManager({
        placeSuggestions: false
      });
      manager.attachAutosuggest('#address', '#searchBoxContainer', selectedSuggestion);
    },
    errorCallback: function (msg) {
      alert(msg);
    },
    credentials: 'Ar-9CgCbalbkrLCgfcSeABL5BqV6kp-nYjUpWBEUwTjjzFbWT14ZWT4Wux3L7dZj'
  });
};

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

  getOrders(function (o) {
    orders = o;
  });

  var getItems = function (onsuccess) {
    db.transaction("menu-items").objectStore("menu-items").getAll().onsuccess = function (event) {
      onsuccess(event.target.result);
    };
  };

  var renderItems = function (items) {
    console.log(items);
    var listEl = $('[data-region="menu"]');
    var compiled = _.template($('#itemTemplate').html());
    var itemsHtml = "";

    items.forEach(function (item) {
      itemsHtml += compiled(item);
    });

    listEl.html(itemsHtml);

    var listItemEl = $('input[type="checkbox"]');

    var onItemToggle = function (e) {
      var inputEl = $(this);
      if (inputEl.is(":checked")) {
        state.items.push({name: inputEl.attr('id')});
      } else {
        state.items = state.items.filter(item => item.name !== inputEl.attr('id'));
      }
    };

    listItemEl.change(onItemToggle)
  };

  var storeOrder = function (order, oncomplete) {
    var transaction = db.transaction(["orders"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
      oncomplete();
    };

    transaction.onerror = function (event) {
      // Don't forget to handle errors!
    };

    var objectStore = transaction.objectStore("orders");
    var req = objectStore.add(order);
    console.log('req', req);
    req.onsuccess = function (e) {
      var orderId = e.target.result;
      window.location.href = '/deliverage/pages/order-detail.html?id=' + orderId;
    };
    req.onerror = function (e) {
      console.log('error', e);
    };
  };

  $(document).ready(function () {
    getItems(renderItems);

    var clientInputEl = $('input#client');
    var timeInputEl = $('input#time');
    var formEl = $('[data-action="addOrder"]');

    var onClientFocusOut = function (e) {
      state.client = e.target.value;
    };

    var onTimeFocusOut = function (e) {
      state.time = e.target.value;
    };

    clientInputEl.blur(onClientFocusOut);
    timeInputEl.blur(onTimeFocusOut);

    formEl.submit(function (e) {
      e.preventDefault();
      storeOrder(state, function () {
        state = {
          client: '',
          address: null,
          time: null,
          items: []
        }
      });
    });
  });
};


//TODO calcola distanza tra address e posizione corrente
//TODO mostra avviso se due ordini pending hanno address con distanza < che tornare ad home @https://docs.microsoft.com/en-us/bingmaps/v8-web-control/map-control-concepts/spatial-math-module-examples/basic-core-spatial-math-example