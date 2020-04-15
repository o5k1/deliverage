var state = {
  client: '',
  address: null,
  time: null,
  items: []
};

onMapLoaded = function () {
  var selectedSuggestion = function (result) {
    state.address = result;
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

$(document).ready(function () {
  var clientInputEl = $('input#client');
  var timeInputEl = $('input#time');

  var onClientFocusOut = function (e) {
    state.client = e.target.value;
  };

  var onTimeFocusOut = function (e) {
    state.time = e.target.value;
  };

  clientInputEl.blur(onClientFocusOut);
  timeInputEl.blur(onTimeFocusOut);
});

//TODO calcola distanza tra address e posizione corrente
//TODO salva ordine
//TODO mostra avviso se due ordini pending hanno address con distanza < che tornare ad home @https://docs.microsoft.com/en-us/bingmaps/v8-web-control/map-control-concepts/spatial-math-module-examples/basic-core-spatial-math-example