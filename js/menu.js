var db = null;
var request = window.indexedDB.open("deliverage", 1);
request.onsuccess = function (e) {
  console.log("onsuccess");
  console.log("db opened:", e);
  db = e.target.result;
  console.log("db:", db);

  /**
   * Store item into db.
   * @param item
   * @param oncomplete
   */
  var storeItem = function (item, oncomplete) {
    var transaction = db.transaction(["menu-items"], "readwrite");

    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
      oncomplete();
      console.log("item added, draw list");
    };

    transaction.onerror = function (event) {
      // Don't forget to handle errors!
    };

    var objectStore = transaction.objectStore("menu-items");
    objectStore.add(item);
  };

  var getItems = function (onsuccess) {
    var items = [];

    db.transaction("menu-items").objectStore("menu-items").openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var item = cursor.value;
        item.key = cursor.primaryKey;
        items.push(item);
        cursor.continue();
      } else {
        onsuccess(items);
      }
    };
  };

  var deleteItem = function (key, onsuccess) {
    var request = db.transaction(["menu-items"], "readwrite")
      .objectStore("menu-items")
      .delete(parseInt(key));
    request.onsuccess = function (event) {
      onsuccess();
    };
  };

  var renderItems = function (items) {
    var listEl = $('[data-region="menu"]');
    var compiled = _.template('<li class="deliverage-menu__item" data-key="<%= key %>" data-name="<%= name %>"><span><%= name %></span><button type="button" data-toggle="modal" data-target="#deleteItemModal" class="btn btn-danger btn-sm">Delete</button></li>');
    var itemsHtml = "";

    items.forEach(function (item) {
      itemsHtml += compiled(item);
    });

    listEl.html(itemsHtml);

    var deleteItemButtonEl = $('[data-target="#deleteItemModal"]');
    deleteItemButtonEl.click(function (e) {
      var key = $(this).parents(".deliverage-menu__item").attr('data-key');
      var name = $(this).parents(".deliverage-menu__item").attr('data-name');
      var modalEl = $("#deleteItemModal");
      modalEl.find("[data-region='itemName']").html(name);

      var confirmButtonEl = modalEl.find("[data-action='deleteItem']");
      confirmButtonEl.click(function (e) {
        deleteItem(key, function () {
          modalEl.modal('hide');
          $(".deliverage-menu__item[data-key=" + key + "]").remove();
        })
      })
    })
  };

  $(document).ready(function () {
    getItems(renderItems);

    var saveButtonEl = $('[data-action="saveItem"]');
    var modalEl = $('.modal');
    saveButtonEl.click(function (e) {
      var nameInputEl = $('input#name');
      var name = nameInputEl.val();
      nameInputEl.val('');
      storeItem({name: name}, function () {
        getItems(renderItems);
        modalEl.modal('hide');
      });
    });
  });
};