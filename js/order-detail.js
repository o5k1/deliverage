$(document).ready(function () {
  var search = window.location.search;
  var id = parseInt(search.replace('?id=', '0'));

  var titleEl = $('.deliverage-page__title');
  titleEl.html('Order ' + id);
});